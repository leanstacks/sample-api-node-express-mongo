import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message}`, { name: err.name, stack: err.stack });
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    switch (err.name) {
      case 'ValidationError':
        res.status(422).send({ message: err.message });
        break;
      case 'TokenExpiredError':
        res.status(400).send({ message: 'token expired' });
        break;
      case 'JsonWebTokenError':
        res.status(400).send({ message: 'token invalid' });
        break;
      case 'AccountExistsError':
        res.status(409).send({ message: 'account exists' });
        break;
      default:
        res.status(500).end();
    }
  } catch (err) {
    next(err);
  }
};
