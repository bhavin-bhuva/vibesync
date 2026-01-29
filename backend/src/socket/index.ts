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
    userId: number;
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

      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number; email: string };
      socket.user = decoded;

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
        // Update user online status to false
        await db.update(users)
          .set({ online: false, lastSeen: new Date() })
          .where(eq(users.id, userId));
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
