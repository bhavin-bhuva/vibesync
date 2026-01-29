import { db } from '../config/database';
import { users, friendRequests, friendships } from '../db/schema';
import { eq, and, or, sql } from 'drizzle-orm';

export class FriendService {
  /**
   * Send a friend request by friend code
   */
  async sendFriendRequest(senderId: string, friendCode: string) {
    // Find the user by friend code
    const [recipient] = await db
      .select()
      .from(users)
      .where(eq(users.friendCode, friendCode))
      .limit(1);

    if (!recipient) {
      throw new Error('User not found with this friend code');
    }

    if (recipient.id === senderId) {
      throw new Error('You cannot send a friend request to yourself');
    }

    // Check if they are already friends
    const existingFriendship = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(eq(friendships.userId, senderId), eq(friendships.friendId, recipient.id)),
          and(eq(friendships.userId, recipient.id), eq(friendships.friendId, senderId))
        )
      )
      .limit(1);

    if (existingFriendship.length > 0) {
      throw new Error('You are already friends with this user');
    }

    // Check if there's already a pending request
    const existingRequest = await db
      .select()
      .from(friendRequests)
      .where(
        and(
          or(
            and(eq(friendRequests.senderId, senderId), eq(friendRequests.receiverId, recipient.id)),
            and(eq(friendRequests.senderId, recipient.id), eq(friendRequests.receiverId, senderId))
          ),
          eq(friendRequests.status, 'pending')
        )
      )
      .limit(1);

    if (existingRequest.length > 0) {
      throw new Error('A friend request already exists between you and this user');
    }

    // Create the friend request
    const [request] = await db
      .insert(friendRequests)
      .values({
        senderId,
        receiverId: recipient.id,
        status: 'pending',
      })
      .returning();

    return {
      request,
      recipient: {
        id: recipient.id,
        name: recipient.name,
        avatar: recipient.avatar,
        friendCode: recipient.friendCode,
      },
    };
  }

  /**
   * Get all pending friend requests for a user (received)
   */
  async getPendingRequests(userId: string) {
    const requests = await db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        senderName: users.name,
        senderAvatar: users.avatar,
        senderFriendCode: users.friendCode,
        createdAt: friendRequests.createdAt,
      })
      .from(friendRequests)
      .innerJoin(users, eq(friendRequests.senderId, users.id))
      .where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, 'pending')));

    return requests;
  }

  /**
   * Accept a friend request
   */
  async acceptFriendRequest(requestId: string, userId: string) {
    // Get the friend request
    const [request] = await db
      .select()
      .from(friendRequests)
      .where(and(eq(friendRequests.id, requestId), eq(friendRequests.receiverId, userId)))
      .limit(1);

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('This friend request has already been processed');
    }

    // Update request status
    await db
      .update(friendRequests)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(friendRequests.id, requestId));

    // Create bidirectional friendship
    await db.insert(friendships).values([
      { userId: request.senderId, friendId: request.receiverId },
      { userId: request.receiverId, friendId: request.senderId },
    ]);

    return { success: true };
  }

  /**
   * Decline a friend request
   */
  async declineFriendRequest(requestId: string, userId: string) {
    const [request] = await db
      .select()
      .from(friendRequests)
      .where(and(eq(friendRequests.id, requestId), eq(friendRequests.receiverId, userId)))
      .limit(1);

    if (!request) {
      throw new Error('Friend request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('This friend request has already been processed');
    }

    await db
      .update(friendRequests)
      .set({ status: 'declined', updatedAt: new Date() })
      .where(eq(friendRequests.id, requestId));

    return { success: true };
  }

  /**
   * Get all friends for a user
   */
  async getFriends(userId: string) {
    const friends = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        friendCode: users.friendCode,
        avatar: users.avatar,
        status: users.status,
        online: users.online,
        lastSeen: users.lastSeen,
        friendshipCreatedAt: friendships.createdAt,
      })
      .from(friendships)
      .innerJoin(users, eq(friendships.friendId, users.id))
      .where(eq(friendships.userId, userId))
      .orderBy(sql`${users.online} DESC, ${users.name} ASC`);

    return friends;
  }

  /**
   * Remove a friend
   */
  async removeFriend(userId: string, friendId: string) {
    // Delete both sides of the friendship
    await db
      .delete(friendships)
      .where(
        or(
          and(eq(friendships.userId, userId), eq(friendships.friendId, friendId)),
          and(eq(friendships.userId, friendId), eq(friendships.friendId, userId))
        )
      );

    return { success: true };
  }

  /**
   * Check if two users are friends
   */
  async areFriends(userId: string, friendId: string): Promise<boolean> {
    const [friendship] = await db
      .select()
      .from(friendships)
      .where(and(eq(friendships.userId, userId), eq(friendships.friendId, friendId)))
      .limit(1);

    return !!friendship;
  }
}
