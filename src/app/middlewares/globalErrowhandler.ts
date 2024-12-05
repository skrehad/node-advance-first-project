import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = 500;
  const message = 'Something went wrong';
  res.status(statusCode).json({
    success: false,
    message,
    error: error,
  });
  return;
};
export default globalErrorHandler;
