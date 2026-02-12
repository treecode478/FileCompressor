import User from '../models/User.js';

export const userRepository = {
  create(data) {
    return User.create(data);
  },

  findById(id) {
    return User.findById(id);
  },

  findByPhone(phone) {
    return User.findOne({ phone });
  },

  findByEmail(email) {
    return User.findOne({ email });
  },

  async updateById(id, updates) {
    return User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
  },

  async incrementTokenVersion(id) {
    return User.findByIdAndUpdate(
      id,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );
  }
};

