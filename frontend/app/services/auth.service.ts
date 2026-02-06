import { apiRequest } from './api-client';

export interface User {
  id: string;
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

export * from './token.service';
