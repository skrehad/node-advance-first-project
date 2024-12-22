import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './../user/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidation),
  AuthControllers.forgetPassword,
);

export const AuthRoutes = router;
