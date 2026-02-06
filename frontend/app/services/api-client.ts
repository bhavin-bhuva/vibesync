import { getAccessToken, getRefreshToken, storeTokens, clearTokens } from './token.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_BASE_URL = `${API_URL}/api/v1`;

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Ensure Bearer prefix
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({})); // Handle empty/invalid JSON

  if (response.status === 401) {
    const refreshToken = getRefreshToken();

    // Determine if this 401 is from a refresh attempt itself
    const isRefreshRequest = endpoint === '/auth/refresh';

    if (refreshToken && !isRefreshRequest) {
      try {
        // Attempt to refresh the token using a direct fetch to avoid recursion
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData: RefreshResponse = await refreshResponse.json();
          const newAccessToken = refreshData.data.accessToken;

          storeTokens(newAccessToken, refreshToken); // Update accessToken, keep old refreshToken

          // Retry original request with new token
          headers['Authorization'] = `Bearer ${newAccessToken}`;

          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });

          // Re-parse the response for the retried request
          const retryData = await response.json();
          if (!response.ok) {
            throw new Error(retryData.error?.message || 'Request failed after refresh');
          }
          return retryData.data;
        } else {
          console.error('Session expired: Refresh failed');
          clearTokens();
          // Optional: trigger a redirect or event
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (err) {
        console.error('Session expired: Error refreshing token', err);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else {
      // No refresh token or it was a failed refresh request
      clearTokens();
    }
  }

  if (!response.ok) {
    throw new Error(data.error?.message || 'Request failed');
  }

  return data.data;
}
