import Conversation from '../models/Conversation.js';

export const conversationRepository = {
  async getOrCreateDm(userId, otherUserId) {
    const participants = [userId, otherUserId].sort();
    let convo = await Conversation.findOne({
      type: 'dm',
      participants: { $all: participants, $size: 2 }
    });

    if (!convo) {
      convo = await Conversation.create({
        type: 'dm',
        participants
      });
    }
    return convo;
  },

  listForUser(userId, { page, limit }) {
    const safeLimit = Math.min(limit || 20, 100);
    const safePage = Math.max(page || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    return Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate('participants', 'name avatarUrl role expert');
  }
};

