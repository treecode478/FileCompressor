// Prometheus metrics registry and basic HTTP request metrics.

import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2]
});

register.registerMetric(httpRequestDuration);

export function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown_route';
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
}

export async function getMetrics() {
  return register.metrics();
}

