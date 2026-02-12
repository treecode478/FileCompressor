// Application-wide logger using pino.
// Structured logs are crucial for debugging and observability at scale.

import pino from 'pino';
import env from './env.js';

const logger = pino({
  level: env.logLevel,
  transport:
    env.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard'
          }
        }
      : undefined
});

export default logger;

