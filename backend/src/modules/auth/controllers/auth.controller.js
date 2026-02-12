import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/auth.service.js';

const REFRESH_COOKIE_NAME = 'kr_refresh';

function setRefreshCookie(res, token) {
  // httpOnly cookie for web clients; mobile apps can store token themselves.
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth'
  });
}

export const authController = {
  async registerWithEmail(req, res) {
    const { user, accessToken, refreshToken } = await authService.registerWithEmail(
      req.body
    );
    setRefreshCookie(res, refreshToken);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: { user, accessToken }
    });
  },

  async loginWithEmail(req, res) {
    const { user, accessToken, refreshToken } = await authService.loginWithEmail(
      req.body
    );
    setRefreshCookie(res, refreshToken);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: { user, accessToken }
    });
  },

  async requestPhoneOtp(req, res) {
    const result = await authService.requestPhoneOtp(req.body);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: { phone: result.phone, sent: result.sent, otpDebug: result.otpDebug }
    });
  },

  async verifyPhoneOtp(req, res) {
    const { user, accessToken, refreshToken } = await authService.verifyPhoneOtp(
      req.body
    );
    setRefreshCookie(res, refreshToken);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: { user, accessToken }
    });
  },

  async refreshTokens(req, res) {
    const bodyToken = req.body.refreshToken;
    const cookieToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const refreshToken = bodyToken || cookieToken;

    const { user, accessToken, refreshToken: newRefreshToken } =
      await authService.refreshTokens({ refreshToken });

    setRefreshCookie(res, newRefreshToken);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: { user, accessToken }
    });
  },

  async logoutAll(req, res) {
    await authService.logoutAllSessions(req.user.id);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
    return res.status(StatusCodes.OK).json({ success: true });
  }
};

