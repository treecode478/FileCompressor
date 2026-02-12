import mongoose from 'mongoose';

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'voice'], required: true },
    durationSeconds: { type: Number }
  },
  { _id: false }
);

const messageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['text', 'image', 'voice'],
      default: 'text'
    },
    text: { type: String, maxlength: 4000 },
    media: mediaSchema,
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;

