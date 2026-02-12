import mongoose from 'mongoose';

const { Schema } = mongoose;

const answerVoteSchema = new Schema(
  {
    answer: {
      type: Schema.Types.ObjectId,
      ref: 'Answer',
      required: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

answerVoteSchema.index({ answer: 1, user: 1 }, { unique: true });

const AnswerVote = mongoose.model('AnswerVote', answerVoteSchema);

export default AnswerVote;

