import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const messageRepository = {
  async createMessage(conversationId, senderId, payload) {
    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      type: payload.type || 'text',
      text: payload.text,
      media: payload.media
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessageAt: message.createdAt,
        lastMessagePreview: message.text || message.type
      }
    });

    return message;
  },

  listMessages(conversationId, { page, limit }) {
    const safeLimit = Math.min(limit || 50, 200);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    return Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('sender', 'name avatarUrl role expert');
  }
};

