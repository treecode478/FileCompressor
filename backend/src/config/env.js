// Centralized environment configuration using dotenv.
// This keeps config isolated so we can later split services out if needed.

import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,

  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/krishiconnect',
  mongoDebug: process.env.MONGO_DEBUG === 'true',

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },

  fcmServerKey: process.env.FCM_SERVER_KEY || '',

  marketApiBaseUrl: process.env.MARKET_API_BASE_URL || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',

  logLevel: process.env.LOG_LEVEL || 'info'
};

export default env;
