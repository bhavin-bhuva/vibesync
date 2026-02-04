import { db } from '../config/database';
import { conversations, conversationParticipants, users, messages } from '../db/schema';
import { eq, and, desc, sql, inArray, gt, count, ne } from 'drizzle-orm';

export class ConversationService {
  /**
   * Get or create a 1-on-1 conversation between two users
   */
  async getOrCreateOneOnOneConversation(userId1: string, userId2: string) {
    // 1. Check if a 1-on-1 conversation already exists
    // We need to find a conversation that has exactly these two participants and is_group = false

    // This query is a bit complex in standard SQL/ORM without specific helper functions,
    // so we'll do a slightly optimized approach:
    // Find all conversation IDs for user1
    // Find all conversation IDs for user2
    // Intersect them where is_group is false

    const user1Convos = await db
      .select({
        conversationId: conversationParticipants.conversationId
      })
      .from(conversationParticipants)
      .innerJoin(conversations, eq(conversations.id, conversationParticipants.conversationId))
      .where(
        and(
          eq(conversationParticipants.userId, userId1),
          eq(conversations.isGroup, false)
        )
      );

    const user1ConvoIds = user1Convos.map(c => c.conversationId);

    if (user1ConvoIds.length > 0) {
      // Check if user2 is in any of these conversations
      const existingConvo = await db
        .select({
          conversationId: conversationParticipants.conversationId
        })
        .from(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.userId, userId2),
            inArray(conversationParticipants.conversationId, user1ConvoIds)
          )
        )
        .limit(1);

      if (existingConvo.length > 0) {
        return this.getConversationById(existingConvo[0].conversationId);
      }
    }

    // 2. Create new conversation if not exists
    return await db.transaction(async (tx) => {
      // Create conversation record
      const [newConversation] = await tx
        .insert(conversations)
        .values({
          isGroup: false,
        })
        .returning();

      // Add participants
      await tx.insert(conversationParticipants).values([
        { conversationId: newConversation.id, userId: userId1 },
        { conversationId: newConversation.id, userId: userId2 },
      ]);

      return newConversation;
    });
  }

  /**
   * Get conversation details by ID
   */
  async getConversationById(conversationId: string) {
    // Fetch conversation details using explicit select
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    if (!conversation) return null;

    // Fetch participants explicitly
    const participants = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
        online: users.online,
        joinedAt: conversationParticipants.joinedAt
      })
      .from(conversationParticipants)
      .innerJoin(users, eq(users.id, conversationParticipants.userId))
      .where(eq(conversationParticipants.conversationId, conversationId));

    return {
      ...conversation,
      participants
    };
  }

  /**
   * List conversations for a user
   */
  async getUserConversations(userId: string) {
    // Get all conversations user is part of
    const userParticipations = await db
      .select({
        conversationId: conversationParticipants.conversationId,
        lastReadAt: conversationParticipants.lastReadAt,
      })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    const conversationIds = userParticipations.map(p => p.conversationId);

    if (conversationIds.length === 0) return [];

    // Fetch conversation details
    const result = await db
      .select({
        id: conversations.id,
        isGroup: conversations.isGroup,
        name: conversations.name,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(inArray(conversations.id, conversationIds))
      .orderBy(desc(conversations.updatedAt));

    // Enrich with other participants info (for DM names/avatars) and last message
    // This could be optimized, but for now we iterate
    const detailedConversations = await Promise.all(result.map(async (conv) => {
      const participants = await db
        .select({
          id: users.id,
          name: users.name,
          avatar: users.avatar,
          online: users.online,
        })
        .from(conversationParticipants)
        .innerJoin(users, eq(users.id, conversationParticipants.userId))
        .where(eq(conversationParticipants.conversationId, conv.id));

      // Fetch last message
      const [lastMsg] = await db
        .select({
          content: messages.content
        })
        .from(messages)
        .where(eq(messages.conversationId, conv.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Filter out current user for display logic (if DM)
      const otherParticipants = participants.filter(p => p.id !== userId);

      // Calculate unread count
      const userParticipant = await db
        .select({
          lastReadAt: conversationParticipants.lastReadAt,
          joinedAt: conversationParticipants.joinedAt
        })
        .from(conversationParticipants)
        .where(
          and(
            eq(conversationParticipants.conversationId, conv.id),
            eq(conversationParticipants.userId, userId)
          )
        )
        .limit(1);

      const coalescedLastRead = userParticipant[0]?.lastReadAt ?? userParticipant[0]?.joinedAt ?? new Date(0);

      const unreadResult = await db
        .select({ count: count() })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, conv.id),
            gt(messages.createdAt, coalescedLastRead),
            ne(messages.senderId, userId)
          )
        );

      return {
        ...conv,
        participants,
        lastMessage: lastMsg?.content || null,
        // For DMs, name/avatar is the other person if not set specifically
        displayName: conv.isGroup ? conv.name : otherParticipants[0]?.name || 'Unknown User',
        displayAvatar: conv.isGroup ? null : otherParticipants[0]?.avatar,
        online: conv.isGroup ? false : otherParticipants[0]?.online || false, // Logic: if DM and other user is online
        unread: unreadResult[0]?.count || 0,
      };
    }));

    return detailedConversations;
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(userId: string, conversationId: string) {
    const result = await db
      .update(conversationParticipants)
      .set({
        lastReadAt: new Date(),
      })
      .where(
        and(
          eq(conversationParticipants.userId, userId),
          eq(conversationParticipants.conversationId, conversationId)
        )
      );

    // Check if any row was updated. 
    // Drizzle with pg driver returns a result object with rowCount.
    return result.rowCount ? result.rowCount > 0 : false;
  }
  /**
   * Get call history for a user
   */
  async getCallHistory(userId: string) {
    // Find all conversations user is in
    const userConvos = await this.getUserConversations(userId);
    const conversationIds = userConvos.map(c => c.id);

    if (conversationIds.length === 0) return [];

    // Query messages that look like call logs
    // We filter for system messages that start with "Call"
    const callMessages = await db.query.messages.findMany({
      where: and(
        inArray(messages.conversationId, conversationIds),
        eq(messages.messageType, 'system'),
      ),
      orderBy: [desc(messages.createdAt)],
      with: {
        conversation: true,
      }
    });

    // We filter in memory for 'Call%' content since 'like' operator varies by driver/adapter sometimes
    // and we need to map to friendly object
    const history = await Promise.all(callMessages
      .filter(m => m.content.startsWith('Call'))
      .map(async (msg) => {
        // Find the other participant info
        // We can reuse logic from getUserConversations or just fetch freshly
        const participants = await db
          .select({
            id: users.id,
            name: users.name,
            avatar: users.avatar
          })
          .from(conversationParticipants)
          .innerJoin(users, eq(users.id, conversationParticipants.userId))
          .where(eq(conversationParticipants.conversationId, msg.conversationId));

        const other = participants.find(p => p.id !== userId);
        const me = participants.find(p => p.id === userId);

        let type: 'incoming' | 'outgoing' | 'missed' = 'incoming';

        if (msg.senderId === userId) {
          type = 'outgoing';
        } else {
          // If message is from other user
          if (msg.content.includes('declined')) {
            type = 'missed';
          } else if (msg.content.includes('ended')) {
            // Check for duration indicator (bullet "•")
            // If it has duration, it's a completed incoming call.
            // If no duration, it implies it was ended before connection/answer (missed).
            if (msg.content.includes('•')) {
              type = 'incoming';
            } else {
              type = 'missed';
            }
          } else {
            type = 'incoming';
          }
        }

        return {
          id: msg.id,
          name: other?.name || 'Unknown',
          avatar: other?.avatar,
          type,
          timestamp: msg.createdAt, // Return Date object or string
          content: msg.content
        };
      }));

    return history;
  }
}
