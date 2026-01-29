import { apiRequest } from './api-client';

export interface Message {
  id: string; // uuid
  conversationId: string; // uuid
  senderId: string; // uuid
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
export async function getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
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
export async function sendMessage(conversationId: string, content: string, type = 'text'): Promise<Message> {
  return apiRequest(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, type }),
  });
}
