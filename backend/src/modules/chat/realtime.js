import { chatService, verifySocketToken } from './services/chat.service.js';
import logger from '../../config/logger.js';

// Socket.IO handlers are isolated here to keep transport logic
// separate from business logic and HTTP controllers.

export function registerChatHandlers(io, socket) {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  const user = verifySocketToken(token);

  if (!user) {
    logger.warn({ socketId: socket.id }, 'Unauthorized socket connection, disconnecting');
    socket.disconnect(true);
    return;
  }

  socket.data.user = user;
  socket.join(`user:${user.id}`);

  socket.on('chat:joinConversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('chat:sendDm', async (payload, callback) => {
    try {
      const { toUserId, type, text, media } = payload || {};
      if (!toUserId) {
        throw new Error('toUserId is required');
      }

      const result = await chatService.sendDmMessage(
        user.id,
        toUserId,
        { type, text, media },
        io
      );

      if (callback) callback({ ok: true, data: result });
    } catch (err) {
      logger.error({ err }, 'chat:sendDm failed');
      if (callback) callback({ ok: false, error: err.message });
    }
  });
}

