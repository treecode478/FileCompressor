import { StatusCodes } from 'http-status-codes';
import { weatherService } from '../services/weather.service.js';

export const weatherController = {
  async getForecast(req, res) {
    const { lat, lon } = req.query;
    const data = await weatherService.getForecast({ lat, lon });
    return res.status(StatusCodes.OK).json({ success: true, data });
  }
};

