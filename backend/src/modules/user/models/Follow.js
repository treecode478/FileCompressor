import mongoose from 'mongoose';

const { Schema } = mongoose;

// Separate Follow collection to handle large follower graphs efficiently.

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    followee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

export default Follow;

