import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import env from '../../../config/env.js';
import { getRedisClient } from '../../../config/db.js';
import { userRepository } from '../../user/repositories/user.repository.js';

const OTP_PREFIX = 'otp:phone:';

function signAccessToken(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    isExpert: user.expert?.isVerified || false,
    tokenVersion: user.tokenVersion
  };
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });
}

function signRefreshToken(user) {
  const jti = uuidv4();
  const payload = {
    sub: user.id,
    tokenVersion: user.tokenVersion,
    jti
  };
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });
}

export const authService = {
  async registerWithEmail({ name, phone, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }

    const existingPhone = await userRepository.findByPhone(phone);
    if (existingPhone) {
      const err = new Error('Phone already in use');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      name,
      phone,
      email,
      passwordHash
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken };
  },

  async loginWithEmail({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken };
  },

  async requestPhoneOtp({ phone }) {
    const redis = getRedisClient();
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const key = `${OTP_PREFIX}${phone}`;

    // 5 minute TTL for OTP
    await redis.set(key, otp, { EX: 300 });

    // In production, integrate with SMS provider. For now we just return a flag.
    return { phone, sent: true, otpDebug: env.nodeEnv === 'development' ? otp : undefined };
  },

  async verifyPhoneOtp({ phone, otp }) {
    const redis = getRedisClient();
    const key = `${OTP_PREFIX}${phone}`;
    const storedOtp = await redis.get(key);

    if (!storedOtp || storedOtp !== otp) {
      const err = new Error('Invalid or expired OTP');
      err.statusCode = 400;
      throw err;
    }

    await redis.del(key);

    let user = await userRepository.findByPhone(phone);
    if (!user) {
      // Minimal user record for phone-only login; profile can be completed later.
      user = await userRepository.create({
        name: `Farmer ${phone.slice(-4)}`,
        phone
      });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken };
  },

  async refreshTokens({ refreshToken }) {
    if (!refreshToken) {
      const err = new Error('Refresh token missing');
      err.statusCode = 401;
      throw err;
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
    } catch {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }

    const user = await userRepository.findById(decoded.sub);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      const err = new Error('Refresh token revoked');
      err.statusCode = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken: newRefreshToken };
  },

  async logoutAllSessions(userId) {
    const user = await userRepository.incrementTokenVersion(userId);
    return user;
  }
};

