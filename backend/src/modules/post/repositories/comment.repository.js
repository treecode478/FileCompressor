import Comment from '../models/Comment.js';

export const commentRepository = {
  create(data) {
    return Comment.create(data);
  },

  listByPost(postId, { page, limit }) {
    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    return Comment.find({ post: postId, parentComment: null })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('author', 'name avatarUrl role expert');
  }
};

