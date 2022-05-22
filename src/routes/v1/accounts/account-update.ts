import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService, { Account } from '../../../services/account-service';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateAccount');
    const account: Account = req.body as Account;
    const accountService = new AccountService();
    const updatedAccount = await accountService.updateOne(req?.params?.id, account);

    if (updatedAccount) {
      // do not return sensitive account attributes
      const { _id, username } = updatedAccount;
      res.send({
        _id,
        username,
      });
    } else {
      res.send(404).end();
    }
  } catch (err) {
    next(err);
  }
};
