// Express application bootstrap.
// Wires core middlewares and module routes; HTTP server is created in server.js.

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { applySecurityMiddlewares } from './middlewares/security.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { metricsMiddleware, getMetrics } from './config/metrics.js';

// Route modules (will be implemented module-by-module)
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import postRoutes from './modules/post/routes.js';
import chatRoutes from './modules/chat/routes.js';
import qaRoutes from './modules/qa/routes.js';
import notificationRoutes from './modules/notification/routes.js';
import marketRoutes from './modules/market/routes.js';
import weatherRoutes from './modules/weather/routes.js';

const app = express();

// Basic logging - delegated to pino via morgan stream if desired
app.use(
  morgan(env.nodeEnv === 'development' ? 'dev' : 'combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(metricsMiddleware);

applySecurityMiddlewares(app);

// Health check - used by load balancers / orchestrators
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  const metrics = await getMetrics();
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// API routes, versioned for forward compatibility
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/qa', qaRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/weather', weatherRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

