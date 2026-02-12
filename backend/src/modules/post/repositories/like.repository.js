import Like from '../models/Like.js';

export const likeRepository = {
  async like(postId, userId) {
    try {
      const like = await Like.create({ post: postId, user: userId });
      return like;
    } catch (err) {
      // Ignore duplicate like errors
      if (err.code === 11000) {
        return null;
      }
      throw err;
    }
  },

  async unlike(postId, userId) {
    const res = await Like.findOneAndDelete({ post: postId, user: userId });
    return !!res;
  },

  async hasLiked(postId, userId) {
    const like = await Like.findOne({ post: postId, user: userId });
    return !!like;
  }
};

