import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { marketController } from './controllers/market.controller.js';

const router = Router();

const listSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    state: Joi.string().max(100),
    district: Joi.string().max(100),
    commodity: Joi.string().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

router.get(
  '/',
  validate(listSchema),
  asyncHandler(marketController.listPrices)
);

export default router;

