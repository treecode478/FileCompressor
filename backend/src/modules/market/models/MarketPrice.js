import mongoose from 'mongoose';

const { Schema } = mongoose;

const marketPriceSchema = new Schema(
  {
    state: { type: String, required: true, index: true },
    district: { type: String, index: true },
    market: { type: String, required: true, index: true },
    commodity: { type: String, required: true, index: true },
    variety: { type: String },
    unit: { type: String },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    modalPrice: { type: Number },
    date: { type: Date, required: true, index: true }
  },
  {
    timestamps: true
  }
);

marketPriceSchema.index(
  { state: 1, district: 1, market: 1, commodity: 1, date: -1 }
);

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice;

