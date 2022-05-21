import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import config from '../../../config/config';
import JwtService from '../../../services/jwt-service';
import AccountService from '../../../services/account-service';

export const createToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createToken');
    if (req?.body?.grant_type === 'refresh_token') {
      const jwtService = new JwtService();
      const payload = jwtService.verifyToken(req?.body?.refresh_token);

      const accountService = new AccountService();
      const account = await accountService.findOne(payload.accountId);

      if (account) {
        const accessToken = jwtService.createToken({
          accountId: account._id,
          username: account.username,
        });
        res.send({
          access_token: accessToken,
          expires_in: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
          refresh_token: req?.body?.refresh_token,
          token_type: 'Bearer',
        });
      }
    }

    res.status(400).end();
  } catch (err) {
    next(err);
  }
};
