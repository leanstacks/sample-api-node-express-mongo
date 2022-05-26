import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService, { AccountExistsError } from '../../../services/account-service';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::signUp');
    const accountService = new AccountService();
    const account = await accountService.createOne(req.body);

    // TODO: do not return sensitive account attributes
    res.send(account);
  } catch (err: AccountExistsError | unknown) {
    if (err instanceof AccountExistsError) {
      res.status(409).end();
    } else {
      next(err);
    }
  }
};
