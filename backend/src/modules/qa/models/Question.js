import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, maxlength: 4000 },
    voice: {
      url: { type: String },
      transcript: { type: String }
    },
    tags: [{ type: String, index: true }],
    expertIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    isSolved: { type: Boolean, default: false, index: true },
    bestAnswer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    answersCount: { type: Number, default: 0 },
    upvotesCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

questionSchema.index({ createdAt: -1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;

