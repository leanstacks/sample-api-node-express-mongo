import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(500);
    res.end();
  } catch (err) {
    next(err);
  }
};
