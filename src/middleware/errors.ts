import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message}`, { name: err.name, stack: err.stack });
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    switch (err.name) {
      case 'TokenExpiredError':
        res.status(400);
        res.send({ message: 'token expired' });
        break;
      case 'JsonWebTokenError':
        res.status(400);
        res.send({ message: 'token invalid' });
        break;
      case 'BadRequestError':
        res.status(400);
        res.send({ message: err.message });
        break;
      case 'AccountExistsError':
        res.status(409);
        res.send({ message: 'account exists' });
        break;
      case 'ValidationError':
        res.status(422);
        res.send({ message: err.message });
        break;
      default:
        res.status(500);
        res.end();
    }
  } catch (err) {
    next(err);
  }
};
