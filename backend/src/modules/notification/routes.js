import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { notificationController } from './controllers/notification.controller.js';
import Joi from 'joi';

const router = Router();

const listSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

const idSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});

router.get(
  '/',
  authRequired,
  validate(listSchema),
  asyncHandler(notificationController.list)
);

router.post(
  '/:id/read',
  authRequired,
  validate(idSchema),
  asyncHandler(notificationController.markRead)
);

router.post(
  '/read-all',
  authRequired,
  asyncHandler(notificationController.markAllRead)
);

export default router;

