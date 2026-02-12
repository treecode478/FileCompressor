// Small helper to avoid repetitive try/catch in controllers.

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

