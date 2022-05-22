import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::deleteAccount');
    const accountService = new AccountService();
    const deleted = await accountService.deleteOne(req.params.id);

    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
};
