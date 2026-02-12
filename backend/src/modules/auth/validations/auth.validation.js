import Joi from 'joi';

const phoneRegex = /^[6-9]\d{9}$/; // basic Indian mobile pattern

export const emailRegisterSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(phoneRegex).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const emailLoginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const phoneRequestOtpSchema = Joi.object({
  body: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const phoneVerifyOtpSchema = Joi.object({
  body: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required(),
    otp: Joi.string().length(6).required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().optional()
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

