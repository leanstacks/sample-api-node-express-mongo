import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

export const health = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::health');
    res.send({
      status: HealthStatus.UP,
    });
  } catch (err) {
    next(err);
  }
};
