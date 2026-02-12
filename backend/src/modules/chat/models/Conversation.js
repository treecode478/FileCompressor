import mongoose from 'mongoose';

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['dm', 'group'],
      required: true,
      index: true
    },
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
    ],
    title: { type: String }, // for groups
    lastMessageAt: { type: Date, index: true },
    lastMessagePreview: { type: String }
  },
  {
    timestamps: true
  }
);

conversationSchema.index({ participants: 1, type: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;

