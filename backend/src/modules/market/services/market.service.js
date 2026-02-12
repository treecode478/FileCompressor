import axios from 'axios';
import env from '../../../config/env.js';
import { marketRepository } from '../repositories/market.repository.js';
import logger from '../../../config/logger.js';

export const marketService = {
  async refreshAll() {
    if (!env.marketApiBaseUrl) {
      logger.warn('MARKET_API_BASE_URL not configured, skipping market refresh');
      return;
    }

    try {
      const resp = await axios.get(`${env.marketApiBaseUrl}/mandi-prices`, {
        timeout: 10000
      });
      const raw = resp.data?.data || resp.data || [];
      const prices = raw.map((item) => ({
        state: item.state,
        district: item.district,
        market: item.market || item.mandi,
        commodity: item.commodity,
        variety: item.variety,
        unit: item.unit,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        modalPrice: item.modalPrice,
        date: item.date ? new Date(item.date) : new Date()
      }));

      await marketRepository.upsertMany(prices);
      logger.info({ count: prices.length }, 'Market prices refreshed');
    } catch (err) {
      logger.error({ err }, 'Failed to refresh market prices');
    }
  },

  async query(params) {
    return marketRepository.query(params);
  }
};

