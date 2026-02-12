import MarketPrice from '../models/MarketPrice.js';

export const marketRepository = {
  async upsertMany(prices) {
    if (!prices?.length) return;
    const ops = prices.map((p) => ({
      updateOne: {
        filter: {
          state: p.state,
          district: p.district,
          market: p.market,
          commodity: p.commodity,
          date: p.date
        },
        update: { $set: p },
        upsert: true
      }
    }));
    await MarketPrice.bulkWrite(ops, { ordered: false });
  },

  async query({ state, district, commodity, page, limit }) {
    const filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (commodity) filter.commodity = commodity;

    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const prices = await MarketPrice.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(safeLimit);

    return { prices, page: safePage, limit: safeLimit };
  }
};

