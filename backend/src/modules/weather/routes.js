import { Router } from 'express';
import Joi from 'joi';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { weatherController } from './controllers/weather.controller.js';

const router = Router();

const forecastSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required()
  })
});

router.get(
  '/forecast',
  validate(forecastSchema),
  asyncHandler(weatherController.getForecast)
);

export default router;

