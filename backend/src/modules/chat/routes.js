import { Router } from 'express';
import Joi from 'joi';
import { authRequired } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { chatController } from './controllers/chat.controller.js';

const router = Router();

const paginationSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

const conversationMessagesSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(200).default(50)
  })
});

router.get(
  '/conversations',
  authRequired,
  validate(paginationSchema),
  asyncHandler(chatController.listConversations)
);

router.get(
  '/conversations/:id/messages',
  authRequired,
  validate(conversationMessagesSchema),
  asyncHandler(chatController.listMessages)
);

export default router;

