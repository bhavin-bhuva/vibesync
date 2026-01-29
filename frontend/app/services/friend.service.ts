import { apiRequest } from './api-client';

export interface Friend {
  id: number;
  name: string;
  email: string;
  friendCode: string;
  avatar?: string;
  status: string;
  online: boolean;
  lastSeen: string | null;
  friendshipCreatedAt: string;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  senderFriendCode: string;
  createdAt: string;
}

export interface SendFriendRequestResponse {
  request: {
    id: number;
    senderId: number;
    receiverId: number;
    status: string;
    createdAt: string;
  };
  recipient: {
    id: number;
    name: string;
    avatar?: string;
    friendCode: string;
  };
}

/**
 * Send a friend request by friend code
 */
export async function sendFriendRequest(friendCode: string): Promise<SendFriendRequestResponse> {
  return apiRequest('/friends/request', {
    method: 'POST',
    body: JSON.stringify({ friendCode }),
  });
}

/**
 * Get all pending friend requests (received)
 */
export async function getPendingFriendRequests(): Promise<FriendRequest[]> {
  return apiRequest('/friends/requests', {
    method: 'GET',
  });
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(requestId: number): Promise<{ success: boolean }> {
  return apiRequest(`/friends/request/${requestId}/accept`, {
    method: 'PUT',
  });
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(requestId: number): Promise<{ success: boolean }> {
  return apiRequest(`/friends/request/${requestId}/decline`, {
    method: 'PUT',
  });
}

/**
 * Get all friends
 */
export async function getFriends(): Promise<Friend[]> {
  return apiRequest('/friends', {
    method: 'GET',
  });
}

/**
 * Remove a friend
 */
export async function removeFriend(friendId: number): Promise<{ success: boolean }> {
  return apiRequest(`/friends/${friendId}`, {
    method: 'DELETE',
  });
}
