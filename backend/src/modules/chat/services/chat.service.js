import jwt from 'jsonwebtoken';
import env from '../../../config/env.js';
import { conversationRepository } from '../repositories/conversation.repository.js';
import { messageRepository } from '../repositories/message.repository.js';
import { notificationService } from '../../notification/services/notification.service.js';

export function verifySocketToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export const chatService = {
  async listConversations(userId, { page, limit }) {
    const convos = await conversationRepository.listForUser(userId, { page, limit });
    return convos;
  },

  async listMessages(userId, conversationId, { page, limit }) {
    // In a full implementation we would verify that userId is a participant of the conversation.
    return messageRepository.listMessages(conversationId, { page, limit });
  },

  async sendDmMessage(senderId, receiverId, payload, io) {
    const convo = await conversationRepository.getOrCreateDm(senderId, receiverId);
    const message = await messageRepository.createMessage(convo.id, senderId, payload);

    const eventPayload = {
      conversationId: convo.id,
      messageId: message.id,
      senderId,
      receiverId,
      type: message.type,
      text: message.text,
      media: message.media,
      createdAt: message.createdAt
    };

    io.to(`user:${receiverId}`).emit('chat:message', eventPayload);
    io.to(`conversation:${convo.id}`).emit('chat:message', eventPayload);

    await notificationService.safeCreate({
      userId: receiverId,
      type: 'message',
      title: 'New message',
      body: message.text || 'You received a new message.',
      data: { conversationId: convo.id, messageId: message.id }
    });

    return { convo, message };
  }
};

