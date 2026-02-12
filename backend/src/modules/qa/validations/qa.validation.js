import Joi from 'joi';

const voiceSchema = Joi.object({
  url: Joi.string().uri().required(),
  transcript: Joi.string().allow('')
});

export const askQuestionSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(200).required(),
    body: Joi.string().max(4000).allow(''),
    voice: voiceSchema.optional(),
    tags: Joi.array().items(Joi.string().max(50)).max(10),
    expertIds: Joi.array().items(Joi.string().hex().length(24)).max(10)
  }),
  params: Joi.object({}),
  query: Joi.object({})
});

export const listQuestionsSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(20),
    tag: Joi.string().max(50),
    isSolved: Joi.boolean()
  })
});

export const questionIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});

export const answerSchema = Joi.object({
  body: Joi.object({
    body: Joi.string().max(4000).required(),
    voice: voiceSchema.optional()
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});

export const answerIdSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({})
});

