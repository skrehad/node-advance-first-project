import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500;
  const message = 'Something went wrong';
  return res.status(statusCode).json({
    success: false,
    message,
    error: error,
  });
};
export default globalErrorHandler;
