import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    bio: Joi.string().max(300),
    avatarUrl: Joi.string().uri(),
    coverUrl: Joi.string().uri(),
    location: Joi.object({
      state: Joi.string().max(100),
      district: Joi.string().max(100),
      village: Joi.string().max(100)
    }),
    languages: Joi.array().items(Joi.string().max(50))
  }).min(1),
  params: Joi.object({}),
  query: Joi.object({})
});

export const paginationSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().hex().length(24).required()
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
});

