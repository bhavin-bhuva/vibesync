import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger.util';
import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';

const conversationService = new ConversationService();
const messageService = new MessageService();

interface AuthSocket extends Socket {
  user?: {
    userId: string;
    email: string;
  };
}

let io: Server;
// Track call start times in memory: conversationId -> timestamp
const callStartTimes = new Map<string, number>();

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; email: string };
      socket.user = decoded;

      // Validate that userId is a valid UUID before querying
      // This protects against stale tokens with integer IDs causing DB crashes
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(decoded.userId)) {
        return next(new Error('Authentication error: Invalid user ID format'));
      }

      // Update user online status
      await db.update(users)
        .set({ online: true, lastSeen: new Date() })
        .where(eq(users.id, decoded.userId));

      // Broadcast user online status
      io.emit('user:status', {
        userId: decoded.userId,
        online: true,
        lastSeen: new Date()
      });

      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    logger.info(`User connected: ${socket.user?.userId}`);
    const userId = socket.user?.userId;

    if (userId) {
      // Join a room specifically for this user (for notifications, etc.)
      socket.join(`user:${userId}`);
    }

    socket.on('join_conversation', (conversationId: string) => {
      logger.info(`User ${userId} joined conversation: ${conversationId}`);
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      logger.info(`User ${userId} left conversation: ${conversationId}`);
      socket.leave(`conversation:${conversationId}`);
    });

    // --- Call Signaling Events ---
    socket.on('call:initiate', async (data: { conversationId: string; recipientId: string; signalData: any; isVideo: boolean }) => {
      // Security Check: Access Control
      const conversation = await conversationService.getConversationById(data.conversationId);
      if (!conversation) {
        logger.warn(`User ${userId} attempted call:initiate on missing conversation ${data.conversationId}`);
        return;
      }

      const isParticipant = conversation.participants.some((p: any) => p.id === userId);
      const isRecipient = conversation.participants.some((p: any) => p.id === data.recipientId);

      if (!isParticipant) {
        logger.warn(`User ${userId} attempted call:initiate on conversation ${data.conversationId} without membership`);
        return;
      }
      if (!isRecipient) {
        logger.warn(`User ${userId} attempted call:initiate to non-member ${data.recipientId} in conversation ${data.conversationId}`);
        return;
      }

      logger.info(`User ${userId} initiating call to ${data.recipientId}`);

      try {
        // Fetch caller details to send to recipient
        const caller = await db.query.users.findFirst({
          where: eq(users.id, userId!),
          columns: {
            name: true,
            avatar: true,
          }
        });

        io.to(`user:${data.recipientId}`).emit('call:incoming', {
          callerId: userId,
          callerName: caller?.name,
          callerAvatar: caller?.avatar,
          conversationId: data.conversationId,
          signalData: data.signalData,
          isVideo: data.isVideo
        });
      } catch (error) {
        logger.error(`Error fetching caller details for call init:`, error);
        // Fallback if DB fetch fails
        io.to(`user:${data.recipientId}`).emit('call:incoming', {
          callerId: userId,
          conversationId: data.conversationId,
          signalData: data.signalData,
          isVideo: data.isVideo
        });
      }
    });

    socket.on('call:answer', async (data: { to: string; signal: any; conversationId: string }) => {
      // Security Check
      if (!data.conversationId) return;

      const conversation = await conversationService.getConversationById(data.conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some((p: any) => p.id === userId);
      const isTargetParticipant = conversation.participants.some((p: any) => p.id === data.to);

      if (!isParticipant || !isTargetParticipant) {
        logger.warn(`Authorization failed for call:answer from ${userId} to ${data.to}`);
        return;
      }

      logger.info(`User ${userId} answered call from ${data.to}`);

      // 1. Send signaling
      io.to(`user:${data.to}`).emit('call:accepted', {
        responderId: userId,
        signal: data.signal
      });

      // 2. Track start time (don't send message yet)
      callStartTimes.set(data.conversationId, Date.now());
    });

    socket.on('call:reject', async (data: { to: string; conversationId: string }) => {
      // Security Check
      if (!data.conversationId) return;

      const conversation = await conversationService.getConversationById(data.conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some((p: any) => p.id === userId);
      const isTargetParticipant = conversation.participants.some((p: any) => p.id === data.to);

      if (!isParticipant || !isTargetParticipant) {
        logger.warn(`Authorization failed for call:reject from ${userId} to ${data.to}`);
        return;
      }

      logger.info(`User ${userId} rejected call from ${data.to}`);

      // 1. Send signaling
      io.to(`user:${data.to}`).emit('call:rejected', {
        responderId: userId
      });

      // 2. Persist "Call declined" system message
      try {
        const message = await messageService.sendMessage(userId!, data.conversationId, 'Call declined', 'system');
        io.to(`conversation:${data.conversationId}`).emit('new_message', message);
      } catch (err) {
        logger.error('Failed to create call declined message:', err);
      }
    });

    socket.on('call:end', async (data: { to: string; conversationId: string }) => {
      // Security Check
      if (!data.conversationId) return;

      const conversation = await conversationService.getConversationById(data.conversationId);
      if (!conversation) return;

      const isParticipant = conversation.participants.some((p: any) => p.id === userId);
      const isTargetParticipant = conversation.participants.some((p: any) => p.id === data.to);

      if (!isParticipant || !isTargetParticipant) {
        logger.warn(`Authorization failed for call:end from ${userId} to ${data.to}`);
        return;
      }

      logger.info(`User ${userId} ended call with ${data.to}`);

      // 1. Send signaling
      io.to(`user:${data.to}`).emit('call:ended', {
        enderId: userId
      });

      // 2. Calculate duration and persist "Call ended" system message
      const startTime = callStartTimes.get(data.conversationId);
      let durationText = "";

      if (startTime) {
        const durationMs = Date.now() - startTime;
        const seconds = Math.floor((durationMs / 1000) % 60);
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor(durationMs / (1000 * 60 * 60));

        if (hours > 0) durationText = `${hours}h ${minutes}m ${seconds}s`;
        else if (minutes > 0) durationText = `${minutes}m ${seconds}s`;
        else durationText = `${seconds}s`;

        callStartTimes.delete(data.conversationId);
      }

      const messageContent = durationText ? `Call ended • ${durationText}` : `Call ended`;

      try {
        const message = await messageService.sendMessage(userId!, data.conversationId, messageContent, 'system');
        io.to(`conversation:${data.conversationId}`).emit('new_message', message);
      } catch (err) {
        logger.error('Failed to create call ended message:', err);
      }
    });

    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${socket.user?.userId}`);
      if (userId) {
        // Validate UUID again just to be safe, though connection wouldn't exist without it
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userId)) {
          try {
            // Update user online status to false
            await db.update(users)
              .set({ online: false, lastSeen: new Date() })
              .where(eq(users.id, userId));

            // Broadcast user offline status
            io.emit('user:status', {
              userId: userId,
              online: false,
              lastSeen: new Date()
            });
          } catch (error) {
            logger.error(`Failed to update status for user ${userId}:`, error);
          }
        }
      }
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}
