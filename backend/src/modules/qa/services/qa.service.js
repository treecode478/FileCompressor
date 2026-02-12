import { questionRepository } from '../repositories/question.repository.js';
import { answerRepository } from '../repositories/answer.repository.js';
import { notificationService } from '../../notification/services/notification.service.js';

export const qaService = {
  async askQuestion(authorId, payload) {
    const tags =
      payload.tags?.map((t) => t.toLowerCase()) ??
      [];

    const question = await questionRepository.create({
      author: authorId,
      title: payload.title,
      body: payload.body,
      voice: payload.voice,
      tags,
      expertIds: payload.expertIds
    });

    if (payload.expertIds?.length) {
      for (const expertId of payload.expertIds) {
        await notificationService.safeCreate({
          userId: expertId,
          type: 'answer',
          title: 'You were tagged in a question',
          body: payload.title,
          data: { questionId: question.id }
        });
      }
    }

    return question;
  },

  listQuestions({ tag, isSolved, page, limit }) {
    return questionRepository.list({ tag, isSolved, page, limit });
  },

  async getQuestionWithAnswers(id) {
    const question = await questionRepository.findById(id);
    if (!question) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      throw err;
    }
    const answers = await answerRepository.listByQuestion(id);
    return { question, answers };
  },

  async addAnswer(questionId, authorId, payload) {
    const answer = await answerRepository.create({
      question: questionId,
      author: authorId,
      body: payload.body,
      voice: payload.voice
    });

    await questionRepository.incrementAnswersCount(questionId, 1);

    const question = await questionRepository.findById(questionId);
    if (question && String(question.author) !== String(authorId)) {
      await notificationService.safeCreate({
        userId: question.author,
        type: 'answer',
        title: 'New answer to your question',
        body: payload.body.slice(0, 100),
        data: { questionId, answerId: answer.id }
      });
    }

    return answer;
  },

  async upvoteAnswer(answerId, userId) {
    const vote = await answerRepository.upvote(answerId, userId);
    return !!vote;
  },

  async markSolved(questionId, answerId, userId) {
    const question = await questionRepository.findById(questionId);
    if (!question) {
      const err = new Error('Question not found');
      err.statusCode = 404;
      throw err;
    }

    if (String(question.author) !== String(userId)) {
      const err = new Error('Only the question author can mark as solved');
      err.statusCode = 403;
      throw err;
    }

    const answer = await answerRepository.findById(answerId);
    if (!answer || String(answer.question) !== String(questionId)) {
      const err = new Error('Answer not found for this question');
      err.statusCode = 400;
      throw err;
    }

    await answerRepository.markAccepted(answerId);
    await questionRepository.setSolved(questionId, answerId);

    await notificationService.safeCreate({
      userId: answer.author,
      type: 'answer',
      title: 'Your answer was accepted',
      body: 'The question author marked your answer as solved.',
      data: { questionId, answerId }
    });
  }
};

