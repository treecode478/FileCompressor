// HTTP / Socket.IO server bootstrap.
// This is the main entrypoint for the backend process.

import http from 'http';
import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { connectMongo, connectRedis } from './config/db.js';
import { initSocket } from './config/socket.js';
import { initSentry } from './config/sentry.js';
import { registerMarketJobs } from './modules/market/scheduler.js';

async function start() {
  initSentry();
  await connectMongo();
  await connectRedis();

  const server = http.createServer(app);
  const io = await initSocket(server);

  // Scheduled jobs (market prices, etc.)
  registerMarketJobs();

  server.listen(env.port, () => {
    logger.info({ port: env.port, env: env.nodeEnv }, 'KrishiConnect backend listening');
  });

  // Graceful shutdown
  const shutDown = () => {
    logger.info('Received shutdown signal. Closing server...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
}

start().catch((err) => {
  logger.error({ err }, 'Fatal error during startup');
  process.exit(1);
});

