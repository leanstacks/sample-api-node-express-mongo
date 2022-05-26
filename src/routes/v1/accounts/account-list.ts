import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const listAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::listAccounts');
    const accountService = new AccountService();
    const accounts = await accountService.list();

    res.send(accounts);
  } catch (err) {
    next(err);
  }
};
