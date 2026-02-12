// Centralized Socket.IO setup with Redis adapter.
// This keeps the HTTP layer and realtime layer loosely coupled.

import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import env from './env.js';
import logger from './logger.js';
import { registerChatHandlers } from '../modules/chat/realtime.js';
import { attachNotificationIO } from '../modules/notification/services/notification.service.js';

export async function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ['GET', 'POST']
    }
  });

  // Redis adapter for horizontal scaling
  const pubClient = createClient({ url: env.redisUrl });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id }, 'Socket connected');
    registerChatHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Socket disconnected');
    });
  });

  attachNotificationIO(io);

  return io;
}

