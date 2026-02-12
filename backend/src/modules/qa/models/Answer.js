import mongoose from 'mongoose';

const { Schema } = mongoose;

const answerSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true, maxlength: 4000 },
    voice: {
      url: { type: String },
      transcript: { type: String }
    },
    upvotesCount: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false, index: true }
  },
  {
    timestamps: true
  }
);

answerSchema.index({ question: 1, createdAt: 1 });

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;

