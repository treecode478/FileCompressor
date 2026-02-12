// Request validation middleware using Joi schemas per route.

export function validate(schema) {
  return (req, res, next) => {
    const payload = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map((d) => d.message)
      });
    }

    req.body = value.body;
    req.query = value.query;
    req.params = value.params;
    return next();
  };
}

