import Answer from '../models/Answer.js';
import AnswerVote from '../models/AnswerVote.js';

export const answerRepository = {
  create(data) {
    return Answer.create(data);
  },

  listByQuestion(questionId) {
    return Answer.find({ question: questionId })
      .sort({ createdAt: 1 })
      .populate('author', 'name avatarUrl role expert');
  },

  async upvote(answerId, userId) {
    try {
      const vote = await AnswerVote.create({ answer: answerId, user: userId });
      if (vote) {
        await Answer.findByIdAndUpdate(answerId, {
          $inc: { upvotesCount: 1 }
        });
      }
      return vote;
    } catch (err) {
      if (err.code === 11000) {
        return null;
      }
      throw err;
    }
  },

  async findById(id) {
    return Answer.findById(id);
  },

  async markAccepted(answerId) {
    return Answer.findByIdAndUpdate(
      answerId,
      { $set: { isAccepted: true } },
      { new: true }
    );
  }
};

