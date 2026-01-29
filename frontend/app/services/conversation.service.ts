import { apiRequest } from './api-client';
import type { User } from './user.service';

export interface Conversation {
  id: number;
  isGroup: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
  participants: (User & { joinedAt: string })[];
  // Computed fields from backend or frontend
  displayName?: string;
  displayAvatar?: string;
  lastMessage?: string;
  unread?: number;
  online?: boolean;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
  return apiRequest('/conversations', {
    method: 'GET',
  });
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(id: number): Promise<Conversation> {
  return apiRequest(`/conversations/${id}`, {
    method: 'GET',
  });
}

/**
 * Create or get existing conversation with a user
 */
export async function createConversation(userId: number): Promise<Conversation> {
  return apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
