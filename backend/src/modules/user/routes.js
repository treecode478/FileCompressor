import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { userController } from './controllers/user.controller.js';
import {
  updateProfileSchema,
  paginationSchema
} from './validations/user.validation.js';

const router = Router();

router.get('/me', authRequired, asyncHandler(userController.getMe));
router.get('/:id', asyncHandler(userController.getById));
router.patch(
  '/me',
  authRequired,
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);

router.post(
  '/:id/follow',
  authRequired,
  validate(paginationSchema), // reuse params validation; ignores query/body
  asyncHandler(userController.follow)
);

router.delete(
  '/:id/follow',
  authRequired,
  validate(paginationSchema),
  asyncHandler(userController.unfollow)
);

router.get(
  '/:id/followers',
  validate(paginationSchema),
  asyncHandler(userController.listFollowers)
);

router.get(
  '/:id/following',
  validate(paginationSchema),
  asyncHandler(userController.listFollowing)
);

export default router;

