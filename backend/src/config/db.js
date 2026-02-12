// MongoDB and Redis connections.
// Kept in one place so we can later move them into separate services easily.

import mongoose from 'mongoose';
import { createClient } from 'redis';
import env from './env.js';
import logger from './logger.js';

let redisClient;

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  if (env.mongoDebug) {
    mongoose.set('debug', true);
  }

  try {
    await mongoose.connect(env.mongoUri);
    logger.info({ mongoUri: env.mongoUri }, 'Connected to MongoDB');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection error');
    // Fail fast in production - process manager (PM2/K8s) will restart
    process.exit(1);
  }
}

export async function connectRedis() {
  redisClient = createClient({
    url: env.redisUrl
  });

  redisClient.on('error', (err) => {
    logger.error({ err }, 'Redis Client Error');
  });

  await redisClient.connect();
  logger.info({ redisUrl: env.redisUrl }, 'Connected to Redis');

  return redisClient;
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

