import Joi from 'joi';

const mediaSchema = Joi.object({
  url: Joi.string().uri().required(),
  type: Joi.string().valid('image', 'video').required(),
  sizeBytes: Joi.number().max(20 * 1024 * 1024),
  durationSeconds: Joi.number().min(0)
});

const voiceSchema = Joi.object({
  url: Joi.string().uri().required(),
  transcript: Joi.string().allow('')
});

export const createPostSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().max(2000).allow('', null),
    type: Joi.string().valid('text', 'image', 'video', 'voice').required(),
    media: mediaSchema.when('type', {
      is: Joi.valid('image', 'video'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    }),
    voice: voiceSchema.when('type', {
      is: 'voice',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  }).required(),
  params: Joi.object({}),
  query: Joi.object({})
});

export const feedSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    hashtag: Joi.string().max(100)
  })
});

export const postIdWithPaginationSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

export const commentSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().max(1000).required(),
    parentComment: Joi.string().hex().length(24).optional()
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});

