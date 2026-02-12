import Follow from '../models/Follow.js';
import User from '../models/User.js';

export const followRepository = {
  async follow(followerId, followeeId) {
    const session = await Follow.startSession();
    session.startTransaction();
    try {
      const follow = await Follow.findOneAndUpdate(
        { follower: followerId, followee: followeeId },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true, session }
      );

      if (follow) {
        await User.updateOne({ _id: followerId }, { $inc: { followingCount: 1 } }, { session });
        await User.updateOne({ _id: followeeId }, { $inc: { followersCount: 1 } }, { session });
      }

      await session.commitTransaction();
      session.endSession();
      return follow;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  async unfollow(followerId, followeeId) {
    const session = await Follow.startSession();
    session.startTransaction();
    try {
      const result = await Follow.findOneAndDelete(
        { follower: followerId, followee: followeeId },
        { session }
      );

      if (result) {
        await User.updateOne({ _id: followerId }, { $inc: { followingCount: -1 } }, { session });
        await User.updateOne({ _id: followeeId }, { $inc: { followersCount: -1 } }, { session });
      }

      await session.commitTransaction();
      session.endSession();
      return !!result;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  listFollowers(userId, { limit, skip }) {
    return Follow.find({ followee: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('follower', 'name avatarUrl role expert');
  },

  listFollowing(userId, { limit, skip }) {
    return Follow.find({ follower: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('followee', 'name avatarUrl role expert');
  }
};

