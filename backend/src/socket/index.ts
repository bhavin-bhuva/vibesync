import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger.util';
import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface AuthSocket extends Socket {
  user?: {
    userId: string;
    email: string;
  };
}

let io: Server;

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

    socket.on('call:answer', (data: { to: string; signal: any }) => {
      logger.info(`User ${userId} answered call from ${data.to}`);
      io.to(`user:${data.to}`).emit('call:accepted', {
        responderId: userId,
        signal: data.signal
      });
    });

    socket.on('call:reject', (data: { to: string }) => {
      logger.info(`User ${userId} rejected call from ${data.to}`);
      io.to(`user:${data.to}`).emit('call:rejected', {
        responderId: userId
      });
    });

    socket.on('call:end', (data: { to: string }) => {
      logger.info(`User ${userId} ended call with ${data.to}`);
      io.to(`user:${data.to}`).emit('call:ended', {
        enderId: userId
      });
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
