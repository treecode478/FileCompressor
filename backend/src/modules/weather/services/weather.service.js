import axios from 'axios';
import env from '../../../config/env.js';
import { getRedisClient } from '../../../config/db.js';
import logger from '../../../config/logger.js';

const CACHE_TTL_SECONDS = 15 * 60;

function buildCacheKey(lat, lon) {
  return `weather:${lat}:${lon}`;
}

export const weatherService = {
  async getForecast({ lat, lon }) {
    if (!lat || !lon) {
      const err = new Error('lat and lon are required');
      err.statusCode = 400;
      throw err;
    }

    const redis = getRedisClient();
    const cacheKey = buildCacheKey(lat, lon);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    if (!env.weatherApiKey) {
      const err = new Error('Weather API not configured');
      err.statusCode = 500;
      throw err;
    }

    try {
      // Example: OpenWeather One Call API 3.0 style; adjust URL to real provider.
      const resp = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
        params: {
          lat,
          lon,
          exclude: 'minutely,hourly',
          units: 'metric',
          appid: env.weatherApiKey
        },
        timeout: 8000
      });

      const data = {
        current: resp.data.current,
        daily: resp.data.daily?.slice(0, 7) ?? [],
        alerts: resp.data.alerts ?? []
      };

      await redis.set(cacheKey, JSON.stringify(data), { EX: CACHE_TTL_SECONDS });
      return data;
    } catch (err) {
      logger.error({ err }, 'Failed to fetch weather forecast');
      const error = new Error('Failed to fetch weather data');
      error.statusCode = 502;
      throw error;
    }
  }
};

