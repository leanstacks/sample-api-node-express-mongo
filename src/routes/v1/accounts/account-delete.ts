import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import AccountService from '../../../services/account-service';

export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::deleteAccount');

    const accountService = new AccountService();
    await accountService.deleteOne(req.params.id);

    res.status(204).end();
  } catch (err: any) {
    next(err);
  }
};
