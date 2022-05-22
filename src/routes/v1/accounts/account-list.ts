import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const listAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::listAccounts');
    const accountService = new AccountService();
    const accounts = await accountService.list();

    const list = accounts.map((account) => ({ _id: account._id, username: account.username }));
    res.send(list);
  } catch (err) {
    next(err);
  }
};
