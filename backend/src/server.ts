import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { testConnection } from './config/database';
import { logger } from './utils/logger.util';
import { initSocket } from './socket';

async function start() {
  try {
    // Test database connection
    await testConnection();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initSocket(httpServer);

    // Start server
    httpServer.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
      logger.info(`🔌 Socket.io initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
