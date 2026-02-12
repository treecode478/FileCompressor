import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 1000 },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', index: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    createdAt: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);

commentSchema.index({ post: 1, parentComment: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

