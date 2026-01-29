import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MessageService } from '../services/message.service';
import { ConversationService } from '../services/conversation.service'; // Needed to verify access
import { z } from 'zod';
import { getIO } from '../socket';

const messageService = new MessageService();
const conversationService = new ConversationService();

export class MessageController {
  // GET /api/v1/conversations/:id/messages
  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const conversationId = req.params.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      // Access Check
      const conversation = await conversationService.getConversationById(conversationId);
      if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });

      const isParticipant = conversation.participants.some((p: any) => p.id === req.user!.userId);
      if (!isParticipant) return res.status(403).json({ success: false, error: 'Access denied' });

      const messages = await messageService.getMessages(conversationId, limit, offset);

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/conversations/:id/messages
  async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const conversationId = req.params.id;
      const schema = z.object({
        content: z.string().min(1),
        type: z.string().default('text'),
      });

      const { content, type } = schema.parse(req.body);

      // Access Check
      const conversation = await conversationService.getConversationById(conversationId);
      if (!conversation) return res.status(404).json({ success: false, error: 'Conversation not found' });

      const isParticipant = conversation.participants.some((p: any) => p.id === req.user!.userId);
      if (!isParticipant) return res.status(403).json({ success: false, error: 'Access denied' });

      const message = await messageService.sendMessage(
        req.user.userId,
        conversationId,
        content,
        type
      );



      // Emit socket event
      try {
        const io = getIO();
        console.log(`🔌 Emitting new_message to room: conversation:${conversationId}`);
        io.to(`conversation:${conversationId}`).emit('new_message', message);

        // Also emit to individual user rooms for notifications (optional but good for "unread" updates on list)
        // Also emit to individual user rooms for notifications (optional but good for "unread" updates on list)
        conversation.participants.forEach((p: any) => {
          console.log(`🔌 Emitting conversation_updated to user room: user:${p.id}`);
          io.to(`user:${p.id}`).emit('conversation_updated', {
            conversationId,
            lastMessage: message,
            unread: true
          });
        });
      } catch (err) {
        // Log but don't fail the request if socket fails
        console.error('Socket emission failed:', err);
      }

      res.status(201).json({
        success: true,
        data: message,
      });

    } catch (error) {
      next(error);
    }
  }
}
