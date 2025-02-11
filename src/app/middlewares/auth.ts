import { NextFunction, Request, Response } from 'express';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
const HttpStatus = require('http-status-ts');

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log(...requiredRoles);

    const token = req.headers.authorization;

    // console.log('token................', token);
    // checking if the token is missing
    if (!token) {
      throw new AppError(
        HttpStatus.HttpStatus.UNAUTHORIZED,
        'You are not authorized!',
      );
    }

    let decoded;

    try {
      // checking if the given token is valid
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(
        HttpStatus.HttpStatus.NOT_FOUND,
        'You are not authorized !',
      );
    }

    const { role, userId, iat } = decoded;
    // console.log(decoded);

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
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        HttpStatus.HttpStatus.UNAUTHORIZED,
        'You are not authorized !',
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        HttpStatus.HttpStatus.UNAUTHORIZED,
        'You are not authorized!',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
