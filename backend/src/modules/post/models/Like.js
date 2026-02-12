import mongoose from 'mongoose';

const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;

