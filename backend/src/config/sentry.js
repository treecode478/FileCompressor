// Sentry initialization and helper. Kept minimal so it doesn't
// interfere with our own error handler and logging.

import * as Sentry from '@sentry/node';
import env from './env.js';

export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: env.nodeEnv,
    tracesSampleRate: 0.1
  });
}

export function captureException(err) {
  if (!process.env.SENTRY_DSN) return;
  Sentry.captureException(err);
}

