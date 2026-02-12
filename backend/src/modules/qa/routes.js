import { Router } from 'express';
import { authRequired, optionalAuth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { qaController } from './controllers/qa.controller.js';
import {
  askQuestionSchema,
  listQuestionsSchema,
  questionIdSchema,
  answerSchema,
  answerIdSchema
} from './validations/qa.validation.js';

const router = Router();

router.post(
  '/',
  authRequired,
  validate(askQuestionSchema),
  asyncHandler(qaController.askQuestion)
);

router.get(
  '/',
  optionalAuth,
  validate(listQuestionsSchema),
  asyncHandler(qaController.listQuestions)
);

router.get(
  '/:id',
  optionalAuth,
  validate(questionIdSchema),
  asyncHandler(qaController.getQuestion)
);

router.post(
  '/:id/answers',
  authRequired,
  validate(answerSchema),
  asyncHandler(qaController.addAnswer)
);

router.post(
  '/answers/:id/upvote',
  authRequired,
  validate(answerIdSchema),
  asyncHandler(qaController.upvoteAnswer)
);

router.post(
  '/:id/solve',
  authRequired,
  validate(questionIdSchema),
  asyncHandler(qaController.markSolved)
);

export default router;

