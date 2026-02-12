import Notification from '../models/Notification.js';
import { sendFcmNotification } from '../utils/fcm.js';
import logger from '../../../config/logger.js';

let ioRef = null;

export function attachNotificationIO(io) {
  ioRef = io;
}

export const notificationService = {
  async create({ userId, type, title, body, data, fcmToken }) {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      body,
      data
    });

    if (ioRef) {
      ioRef.to(`user:${userId}`).emit('notification:new', {
        id: notification.id,
        type,
        title,
        body,
        data
      });
    }

    if (fcmToken) {
      await sendFcmNotification({ token: fcmToken, title, body, data });
    }

    return notification;
  },

  async safeCreate(payload) {
    try {
      return await this.create(payload);
    } catch (err) {
      logger.error({ err }, 'Failed to create notification');
      return null;
    }
  },

  async listForUser(userId, { page, limit }) {
    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    return { notifications, page: safePage, limit: safeLimit };
  },

  async markRead(userId, notificationId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
  },

  async markAllRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
  }
};

