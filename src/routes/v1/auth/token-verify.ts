import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import JwtService from '../../../services/jwt-service';

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::verifyToken');
    res.send({
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
