import { NextFunction, Request, Response } from 'express';
const HttpStatus = require('http-status-ts');

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpStatus.HttpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    error: '',
  });
  return;
};

export default notFound;
