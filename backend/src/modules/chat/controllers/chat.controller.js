import { StatusCodes } from 'http-status-codes';
import { chatService } from '../services/chat.service.js';

export const chatController = {
  async listConversations(req, res) {
    const { page, limit } = req.query;
    const convos = await chatService.listConversations(req.user.id, {
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, data: convos });
  },

  async listMessages(req, res) {
    const { page, limit } = req.query;
    const messages = await chatService.listMessages(
      req.user.id,
      req.params.id,
      { page: Number(page), limit: Number(limit) }
    );
    return res.status(StatusCodes.OK).json({ success: true, data: messages });
  }
};

