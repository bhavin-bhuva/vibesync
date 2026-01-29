import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import friendRoutes from './routes/friend.routes';
import conversationRoutes from './routes/conversation.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';

import './config/passport';
import passport from 'passport';

export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(passport.initialize());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
  app.use(`/api/${env.API_VERSION}/users`, userRoutes);
  app.use(`/api/${env.API_VERSION}/friends`, friendRoutes);
  app.use(`/api/${env.API_VERSION}/conversations`, conversationRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
