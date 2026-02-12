import { StatusCodes } from 'http-status-codes';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  async list(req, res) {
    const { page, limit } = req.query;
    const result = await notificationService.listForUser(req.user.id, {
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  },

  async markRead(req, res) {
    const notification = await notificationService.markRead(
      req.user.id,
      req.params.id
    );
    return res.status(StatusCodes.OK).json({ success: true, data: notification });
  },

  async markAllRead(req, res) {
    await notificationService.markAllRead(req.user.id);
    return res.status(StatusCodes.OK).json({ success: true });
  }
};

