import { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    success: false,
  });
};
