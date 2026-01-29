import { apiRequest } from './api-client';

export interface User {
  id: number;
  name: string;
  email: string;
  friendCode: string;
  avatar?: string;
  status: string;
  online: boolean;
  lastSeen: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get current logged-in user's data
 */
export async function getCurrentUser(): Promise<User> {
  return apiRequest('/users/me', {
    method: 'GET',
  });
}

/**
 * Update current user's profile
 */
export async function updateProfile(data: {
  name?: string;
  status?: string;
  avatar?: string;
}): Promise<User> {
  return apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
