import { StatusCodes } from 'http-status-codes';
import { userService } from '../services/user.service.js';

export const userController = {
  async getMe(req, res) {
    const user = await userService.getMe(req.user.id);
    return res.status(StatusCodes.OK).json({ success: true, data: user });
  },

  async getById(req, res) {
    const user = await userService.getById(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }
    return res.status(StatusCodes.OK).json({ success: true, data: user });
  },

  async updateProfile(req, res) {
    const updated = await userService.updateProfile(req.user.id, req.body);
    return res.status(StatusCodes.OK).json({ success: true, data: updated });
  },

  async follow(req, res) {
    await userService.follow(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json({ success: true });
  },

  async unfollow(req, res) {
    await userService.unfollow(req.user.id, req.params.id);
    return res.status(StatusCodes.OK).json({ success: true });
  },

  async listFollowers(req, res) {
    const { page, limit } = req.query;
    const result = await userService.listFollowers(req.params.id, {
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  },

  async listFollowing(req, res) {
    const { page, limit } = req.query;
    const result = await userService.listFollowing(req.params.id, {
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  }
};

