import { NextFunction, Request, Response } from 'express';

import logger from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const findAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::findAccount');

    const accountService = new AccountService();
    const account = await accountService.findOne(req.params.id);

    if (account) {
      res.send(account);
    } else {
      res.status(404).end();
    }
  } catch (err: any) {
    next(err);
  }
};
