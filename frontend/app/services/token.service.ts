export function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vibesync_access_token', accessToken);
    localStorage.setItem('vibesync_refresh_token', refreshToken);
  }
}

export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vibesync_access_token');
    localStorage.removeItem('vibesync_refresh_token');
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vibesync_access_token');
  }
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vibesync_refresh_token');
  }
  return null;
}
