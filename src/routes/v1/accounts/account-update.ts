import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService, { Account } from '../../../services/account-service';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateAccount');
    const account: Account = req.body as Account;
    const accountService = new AccountService();
    const updatedAccount = await accountService.updateOne(req?.params?.id, account);

    res.send(updatedAccount);
  } catch (err) {
    next(err);
  }
};
