import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { TErrorSources } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // setting default value
  const statusCode = 500;
  const message = 'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  res.status(statusCode).json({
    success: false,
    message,
    error: error,
  });
  return;
};
export default globalErrorHandler;
