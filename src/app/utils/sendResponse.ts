import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
  },
) => {};
