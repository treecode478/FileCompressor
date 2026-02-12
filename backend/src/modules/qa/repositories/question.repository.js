import Question from '../models/Question.js';

export const questionRepository = {
  create(data) {
    return Question.create(data);
  },

  findById(id) {
    return Question.findById(id);
  },

  async incrementAnswersCount(questionId, delta) {
    return Question.findByIdAndUpdate(
      questionId,
      { $inc: { answersCount: delta } },
      { new: true }
    );
  },

  async setSolved(questionId, bestAnswerId) {
    return Question.findByIdAndUpdate(
      questionId,
      { $set: { isSolved: true, bestAnswer: bestAnswerId } },
      { new: true }
    );
  },

  async list({ tag, isSolved, page, limit }) {
    const filter = {};
    if (tag) filter.tags = tag.toLowerCase();
    if (typeof isSolved === 'boolean') filter.isSolved = isSolved;

    const safeLimit = Math.min(limit || 20, 50);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('author', 'name avatarUrl role expert');

    return { questions, page: safePage, limit: safeLimit };
  }
};

