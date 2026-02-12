// Global security middlewares: Helmet, CORS, rate limiting, sanitization, XSS protection.

import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export function applySecurityMiddlewares(app) {
  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true
    })
  );

  app.use(helmet());

  // Basic rate limiting - can be overridden per route when needed.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use('/api/', limiter);

  app.use(xss());
  app.use(
    mongoSanitize({
      replaceWith: '_'
    })
  );
}

