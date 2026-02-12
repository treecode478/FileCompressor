import { StatusCodes } from 'http-status-codes';
import { postService } from '../services/post.service.js';

export const postController = {
  async createPost(req, res) {
    const post = await postService.createPost(req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json({ success: true, data: post });
  },

  async getFeed(req, res) {
    const { page, limit, hashtag } = req.query;
    const result = await postService.getFeed(req.user?.id, {
      page: Number(page),
      limit: Number(limit),
      hashtag
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  },

  async likePost(req, res) {
    await postService.likePost(req.params.id, req.user.id);
    return res.status(StatusCodes.OK).json({ success: true });
  },

  async unlikePost(req, res) {
    await postService.unlikePost(req.params.id, req.user.id);
    return res.status(StatusCodes.OK).json({ success: true });
  },

  async addComment(req, res) {
    const comment = await postService.addComment(req.params.id, req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json({ success: true, data: comment });
  },

  async listComments(req, res) {
    const { page, limit } = req.query;
    const comments = await postService.listComments(req.params.id, {
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, data: comments });
  },

  async reportPost(req, res) {
    const { reason } = req.body;
    const post = await postService.reportPost(req.params.id, req.user.id, reason);
    return res.status(StatusCodes.OK).json({ success: true, data: post });
  }
};

