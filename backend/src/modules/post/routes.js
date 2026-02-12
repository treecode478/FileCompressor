import { Router } from 'express';
import { authRequired, optionalAuth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { postController } from './controllers/post.controller.js';
import {
  createPostSchema,
  feedSchema,
  postIdWithPaginationSchema,
  commentSchema
} from './validations/post.validation.js';

const router = Router();

router.get(
  '/feed',
  optionalAuth,
  validate(feedSchema),
  asyncHandler(postController.getFeed)
);

router.post(
  '/',
  authRequired,
  validate(createPostSchema),
  asyncHandler(postController.createPost)
);

router.post(
  '/:id/like',
  authRequired,
  validate(postIdWithPaginationSchema),
  asyncHandler(postController.likePost)
);

router.delete(
  '/:id/like',
  authRequired,
  validate(postIdWithPaginationSchema),
  asyncHandler(postController.unlikePost)
);

router.post(
  '/:id/comments',
  authRequired,
  validate(commentSchema),
  asyncHandler(postController.addComment)
);

router.get(
  '/:id/comments',
  validate(postIdWithPaginationSchema),
  asyncHandler(postController.listComments)
);

router.post(
  '/:id/report',
  authRequired,
  asyncHandler(postController.reportPost)
);

export default router;

