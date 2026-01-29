import { apiRequest } from './api-client';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: number, limit = 50, offset = 0): Promise<Message[]> {
  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  }).toString();

  return apiRequest(`/conversations/${conversationId}/messages?${query}`, {
    method: 'GET',
  });
}

/**
 * Send a message to a conversation
 */
export async function sendMessage(conversationId: number, content: string, type = 'text'): Promise<Message> {
  return apiRequest(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, type }),
  });
}
