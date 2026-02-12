import Post from '../models/Post.js';

export const postRepository = {
  create(data) {
    return Post.create(data);
  },

  findById(id) {
    return Post.findById(id);
  },

  async incrementCounts(postId, increments) {
    return Post.findByIdAndUpdate(
      postId,
      { $inc: increments },
      { new: true }
    );
  },

  async markReported(postId) {
    return Post.findByIdAndUpdate(
      postId,
      { $set: { isReported: true }, $inc: { reportsCount: 1 } },
      { new: true }
    );
  },

  async getFeed({ authorIds, hashtag, page, limit }) {
    const filter = {};
    if (authorIds?.length) {
      filter.author = { $in: authorIds };
    }
    if (hashtag) {
      filter.hashtags = hashtag.toLowerCase();
    }

    const safeLimit = Math.min(limit || 20, 50);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('author', 'name avatarUrl role expert');

    return { posts, page: safePage, limit: safeLimit };
  }
};

