import bcrypt from 'bcrypt';
import AppError from '../../errors/AppError';
import { TLoginUser } from './auth.interface';
const HttpStatus = require('http-status-ts');
import { User } from '../user/user.model';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'This user is not found !',
    );
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is deleted !',
    );
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is blocked ! !',
    );
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'Password do not matched',
    );

  //create token and sent to the  client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  console.log(jwtPayload);

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'This user is not found !',
    );
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is deleted !',
    );
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is blocked ! !',
    );
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'Password do not matched',
    );

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      // for when password is changed
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'This user is not found !',
    );
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is deleted !',
    );
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is blocked ! !',
    );
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      HttpStatus.HttpStatus.UNAUTHORIZED,
      'You are not authorized !',
    );
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'This user is not found !',
    );
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is deleted !',
    );
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is blocked ! !',
    );
  }
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?/id=${user.id}&token=${resetToken}`;

  // for sending massage reset password
  sendEmail(user.email, resetUILink);

  // console.log('hello....................', resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(
      HttpStatus.HttpStatus.NOT_FOUND,
      'This user is not found !',
    );
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is deleted !',
    );
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(
      HttpStatus.HttpStatus.FORBIDDEN,
      'This user is blocked ! !',
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  // console.log('hello..........', decoded);

  if (payload.id !== decoded.userId) {
    throw new AppError(HttpStatus.HttpStatus.FORBIDDEN, 'You are forbidden');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update password
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      // for when password is changed
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
