import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createAccount');
    const accountService = new AccountService();
    const account = await accountService.createOne(req.body);
    logger.info({ account });
    res.status(201).send(account);
  } catch (err) {
    next(err);
  }
};
