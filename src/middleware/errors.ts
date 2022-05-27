import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message}`, { name: err.name, stack: err.stack });
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err.name === 'ValidationError') {
      res.status(409).send({
        message: err.message,
      });
    } else {
      res.status(500).end();
    }
  } catch (err) {
    next(err);
  }
};
