import { apiRequest } from './api-client';

export interface User {
  id: number;
  name: string;
  email: string;
  friendCode: string;
  avatar?: string;
  status: string;
  online: boolean;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

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
