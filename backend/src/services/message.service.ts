import { db } from '../config/database';
import { messages, conversations } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export class MessageService {
  /**
   * Send a message in a conversation
   */
  async sendMessage(senderId: string, conversationId: string, content: string, type: string = 'text') {
    return await db.transaction(async (tx) => {
      // 1. Create the message
      const [newMessage] = await tx
        .insert(messages)
        .values({
          conversationId,
          senderId,
          content,
          messageType: type,
        })
        .returning();

      // 2. Update conversation updated_at timestamp
      await tx
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, conversationId));

      return newMessage;
    });
  }

  /**
   * Get messages for a conversation with pagination
   */
  async getMessages(conversationId: string, limit: number = 50, offset: number = 0) {
    const result = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [desc(messages.createdAt)],
      limit,
      offset,
      with: {
        // We'll need to join user manually if relations aren't defined
      }
    });

    // We'll largely rely on the frontend having user data or fetching it, 
    // but often messages need sender details embedded. 
    // Let's assume we want to return messages in reverse chronological order (newest first is typical for querying, 
    // but frontend usually wants oldest-to-newest for rendering history, or we reverse it there).
    // Let's return them such that index 0 is the newest.

    return result;
  }
}
