// Centralized error handling middleware.
// Ensures consistent error responses and proper logging.

import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import logger from '../config/logger.js';
import { captureException } from '../config/sentry.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status =
    err.statusCode && Number.isInteger(err.statusCode)
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    message: err.message || getReasonPhrase(status)
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.details = err.details;
  }

  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    },
    'Request failed'
  );

  captureException(err);

  res.status(status).json(response);
}

export function notFoundHandler(req, res) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Route not found'
  });
}

