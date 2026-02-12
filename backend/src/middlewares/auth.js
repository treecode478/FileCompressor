// JWT authentication middleware.
// Keeps auth concerns separate so routes remain thin.

import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication token missing'
    });
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = {
      id: payload.sub,
      role: payload.role,
      isExpert: payload.isExpert
    };
    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = {
      id: payload.sub,
      role: payload.role,
      isExpert: payload.isExpert
    };
  } catch {
    // ignore errors, treat as anonymous
  }

  return next();
}

