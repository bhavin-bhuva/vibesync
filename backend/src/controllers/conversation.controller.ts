import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ConversationService } from '../services/conversation.service';
import { z } from 'zod';

import { getIO } from '../socket';
const conversationService = new ConversationService();

export class ConversationController {
  // GET /api/v1/conversations
  async listConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const conversations = await conversationService.getUserConversations(req.user.userId);

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/v1/conversations
  async createConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const schema = z.object({
        userId: z.string().uuid(),
      });

      const { userId: targetUserId } = schema.parse(req.body);

      // Prevent creating conversation with self
      if (req.user.userId === targetUserId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_OPERATION',
            message: 'Cannot create conversation with yourself',
          },
        });
      }

      const conversation = await conversationService.getOrCreateOneOnOneConversation(
        req.user.userId,
        targetUserId
      );

      if (!conversation) {
        throw new Error('Failed to get or create conversation');
      }

      // Fetch full details including participants to return consistent structure
      const fullConversation = await conversationService.getConversationById(conversation.id);

      if (!fullConversation) {
        throw new Error('Failed to retrieve created conversation');
      }

      res.status(200).json({
        success: true,
        data: fullConversation,
      });

    } catch (error) {
      next(error);
    }
  }

  // GET /api/v1/conversations/:id
  async getConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      let conversationId: string;
      try {
        const params = paramsSchema.parse(req.params);
        conversationId = params.id;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: 'Invalid Conversation ID format' });
        }
        throw error;
      }

      const conversation = await conversationService.getConversationById(conversationId);

      if (!conversation) {
        return res.status(404).json({ success: false, error: 'Conversation not found' });
      }

      // Check if user is participant
      const isParticipant = conversation.participants.some((p: any) => p.id === req.user!.userId);
      if (!isParticipant) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      res.status(200).json({
        success: true,
        data: conversation
      });

    } catch (error) {
      next(error);
    }
  }

  // PUT /api/v1/conversations/:id/read
  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      let conversationId: string;
      try {
        const params = paramsSchema.parse(req.params);
        conversationId = params.id;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ success: false, error: 'Invalid Conversation ID format' });
        }
        throw error;
      }

      await conversationService.markAsRead(req.user.userId, conversationId);

      // Notify other participants (or just the conversation room)
      const io = getIO();
      io.to(`conversation:${conversationId}`).emit('conversation_read', {
        conversationId,
        userId: req.user.userId,
        readAt: new Date()
      });

      res.status(200).json({
        success: true
      });

    } catch (error) {
      next(error);
    }
  }
}
