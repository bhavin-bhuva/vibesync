import { apiRequest } from './api-client';
import type { User } from './user.service';

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  updatedAt: string;
  participants: any[]; // relaxed type to avoid deep dependency issues for now
  lastMessage?: string | { id: string; content: string; }; // backend sends string or object depending on endpoint
  unread?: number;
  online?: boolean;
  // Computed properties
  displayName?: string;
  displayAvatar?: string;
}

export async function getConversations(): Promise<Conversation[]> {
  return await apiRequest('/conversations');
}

export async function getConversation(id: string): Promise<Conversation> {
  return apiRequest(`/conversations/${id}`, {
    method: 'GET',
  });
}

export async function createConversation(userId: string): Promise<Conversation> {
  return apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function markAsRead(id: string): Promise<boolean> {
  return apiRequest(`/conversations/${id}/read`, {
    method: 'PUT',
  });
}
