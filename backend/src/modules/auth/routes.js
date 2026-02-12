import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authRequired } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authController } from './controllers/auth.controller.js';
import {
  emailRegisterSchema,
  emailLoginSchema,
  phoneRequestOtpSchema,
  phoneVerifyOtpSchema,
  refreshTokenSchema
} from './validations/auth.validation.js';

const router = Router();

router.post(
  '/email/register',
  validate(emailRegisterSchema),
  asyncHandler(authController.registerWithEmail)
);

router.post(
  '/email/login',
  validate(emailLoginSchema),
  asyncHandler(authController.loginWithEmail)
);

router.post(
  '/phone/request-otp',
  validate(phoneRequestOtpSchema),
  asyncHandler(authController.requestPhoneOtp)
);

router.post(
  '/phone/verify-otp',
  validate(phoneVerifyOtpSchema),
  asyncHandler(authController.verifyPhoneOtp)
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshTokens)
);

router.post(
  '/logout-all',
  authRequired,
  asyncHandler(authController.logoutAll)
);

export default router;

