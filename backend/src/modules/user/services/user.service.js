import { userRepository } from '../repositories/user.repository.js';
import { followRepository } from '../repositories/follow.repository.js';

export const userService = {
  getById(id) {
    return userRepository.findById(id);
  },

  async getMe(userId) {
    return userRepository.findById(userId);
  },

  async updateProfile(userId, payload) {
    return userRepository.updateById(userId, payload);
  },

  async follow(userId, targetUserId) {
    if (userId === targetUserId) {
      throw Object.assign(new Error("You can't follow yourself"), { statusCode: 400 });
    }
    return followRepository.follow(userId, targetUserId);
  },

  async unfollow(userId, targetUserId) {
    if (userId === targetUserId) {
      throw Object.assign(new Error("You can't unfollow yourself"), { statusCode: 400 });
    }
    return followRepository.unfollow(userId, targetUserId);
  },

  async listFollowers(userId, { limit, page }) {
    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const followers = await followRepository.listFollowers(userId, { limit: safeLimit, skip });
    return { followers, page: safePage, limit: safeLimit };
  },

  async listFollowing(userId, { limit, page }) {
    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const following = await followRepository.listFollowing(userId, { limit: safeLimit, skip });
    return { following, page: safePage, limit: safeLimit };
  }
};

