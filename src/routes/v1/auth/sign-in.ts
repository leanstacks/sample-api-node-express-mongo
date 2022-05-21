import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import config from '../../../config/config';
import AccountService from '../../../services/account-service';
import JwtService from '../../../services/jwt-service';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::signIn');
    const accountService = new AccountService();
    const account = await accountService.authenticate(req?.body?.username, req?.body?.password);
    if (account) {
      const jwtService = new JwtService();
      const accessToken = jwtService.createToken({
        accountId: account._id,
        username: account.username,
      });
      const refreshToken = jwtService.createToken(
        {
          accountId: account._id,
          username: account.username,
        },
        {
          expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      );
      res.send({
        access_token: accessToken,
        expires_in: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      });
    } else {
      res.status(400).end();
    }
  } catch (err: unknown) {
    next(err);
  }
};
