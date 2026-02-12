import { StatusCodes } from 'http-status-codes';
import { marketService } from '../services/market.service.js';

export const marketController = {
  async listPrices(req, res) {
    const { state, district, commodity, page, limit } = req.query;
    const result = await marketService.query({
      state,
      district,
      commodity,
      page: Number(page),
      limit: Number(limit)
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  }
};

