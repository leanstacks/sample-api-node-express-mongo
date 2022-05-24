import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import { IAccount } from '../../../models/account';
import AccountService from '../../../services/account-service';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateAccount');
    const account: IAccount = req.body as IAccount;
    const accountService = new AccountService();
    const updatedAccount = await accountService.updateOne(req?.params?.id, account);

    if (updatedAccount) {
      // do not return sensitive account attributes
      res.send(updatedAccount);
    } else {
      res.send(404).end();
    }
  } catch (err) {
    next(err);
  }
};
