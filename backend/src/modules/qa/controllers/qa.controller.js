import { StatusCodes } from 'http-status-codes';
import { qaService } from '../services/qa.service.js';

export const qaController = {
  async askQuestion(req, res) {
    const question = await qaService.askQuestion(req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json({ success: true, data: question });
  },

  async listQuestions(req, res) {
    const { page, limit, tag, isSolved } = req.query;
    const result = await qaService.listQuestions({
      page: Number(page),
      limit: Number(limit),
      tag,
      isSolved: typeof isSolved === 'string' ? isSolved === 'true' : undefined
    });
    return res.status(StatusCodes.OK).json({ success: true, ...result });
  },

  async getQuestion(req, res) {
    const data = await qaService.getQuestionWithAnswers(req.params.id);
    return res.status(StatusCodes.OK).json({ success: true, data });
  },

  async addAnswer(req, res) {
    const answer = await qaService.addAnswer(req.params.id, req.user.id, req.body);
    return res.status(StatusCodes.CREATED).json({ success: true, data: answer });
  },

  async upvoteAnswer(req, res) {
    await qaService.upvoteAnswer(req.params.id, req.user.id);
    return res.status(StatusCodes.OK).json({ success: true });
  },

  async markSolved(req, res) {
    await qaService.markSolved(req.params.id, req.body.answerId, req.user.id);
    return res.status(StatusCodes.OK).json({ success: true });
  }
};

