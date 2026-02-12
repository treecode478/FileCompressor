import { postRepository } from '../repositories/post.repository.js';
import { commentRepository } from '../repositories/comment.repository.js';
import { likeRepository } from '../repositories/like.repository.js';
import { extractHashtags } from '../utils/text.utils.js';
import { notificationService } from '../../notification/services/notification.service.js';
import User from '../../user/models/User.js';

const MAX_MEDIA_BYTES = 20 * 1024 * 1024;

export const postService = {
  async createPost(authorId, payload) {
    if (payload.media?.sizeBytes && payload.media.sizeBytes > MAX_MEDIA_BYTES) {
      const err = new Error('Media size exceeds 20MB limit');
      err.statusCode = 400;
      throw err;
    }

    const hashtags = extractHashtags(payload.content);

    const post = await postRepository.create({
      author: authorId,
      content: payload.content,
      media: payload.media,
      voice: payload.voice,
      type: payload.type || 'text',
      hashtags
      // mentions resolved separately if you maintain username mapping
    });

    return post;
  },

  async getFeed(userId, { page, limit, hashtag }) {
    // For now, feed is global or filtered by hashtag. Later we can
    // include following list, region-based filters, etc.
    const { posts, ...meta } = await postRepository.getFeed({
      authorIds: undefined,
      hashtag,
      page,
      limit
    });

    return { posts, ...meta };
  },

  async likePost(postId, userId) {
    const like = await likeRepository.like(postId, userId);
    if (like) {
      await postRepository.incrementCounts(postId, { likesCount: 1 });

      const post = await postRepository.findById(postId);
      if (post && String(post.author) !== String(userId)) {
        await notificationService.safeCreate({
          userId: post.author,
          type: 'like',
          title: 'New like on your post',
          body: 'Someone liked your post.',
          data: { postId }
        });
      }
    }
  },

  async unlikePost(postId, userId) {
    const removed = await likeRepository.unlike(postId, userId);
    if (removed) {
      await postRepository.incrementCounts(postId, { likesCount: -1 });
    }
  },

  async addComment(postId, userId, payload) {
    const comment = await commentRepository.create({
      post: postId,
      author: userId,
      content: payload.content,
      parentComment: payload.parentComment || null
    });

    await postRepository.incrementCounts(postId, { commentsCount: 1 });

    const post = await postRepository.findById(postId);
    if (post && String(post.author) !== String(userId)) {
      await notificationService.safeCreate({
        userId: post.author,
        type: 'comment',
        title: 'New comment on your post',
        body: 'Someone commented on your post.',
        data: { postId, commentId: comment.id }
      });
    }

    return comment;
  },

  listComments(postId, { page, limit }) {
    return commentRepository.listByPost(postId, { page, limit });
  },

  async reportPost(postId, reporterId, reason) {
    const post = await postRepository.markReported(postId);
    // Placeholder: integrate with content moderation pipeline
    await notificationService.safeCreate({
      userId: reporterId,
      type: 'report',
      title: 'Post reported',
      body: 'Thank you for keeping the community safe.',
      data: { postId, reason }
    });
    return post;
  },

  async resolveMentionsForContent(content) {
    // Future: map @username to User IDs via a username field on User.
    // Placeholder to show where that logic would live.
    return User.find({ _id: null });
  }
};

