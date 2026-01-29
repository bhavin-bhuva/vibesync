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
