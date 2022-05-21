import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import config from '../../../config/config';
import JwtService from '../../../services/jwt-service';

export const createToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createToken', { body: req.body });
    // grant_type = 'authorization_code'
    // - find Account by authorizationCode
    // - create access_token & refresh_token
    // grant_type = 'client_credentials'
    // - find Account by clientId/clientSecret
    // - create access_token & refresh_token
    // grant_type = 'refresh_token'
    // - extract accountId from payload; find Account by id
    // - do not create new refresh_token
    const jwtService = new JwtService();
    const accessToken = jwtService.createToken({
      username: req.body.client_id,
      password: req.body.client_secret,
    });
    const refreshToken = jwtService.createToken(
      {
        username: req.body.client_id,
        password: req.body.client_secret,
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
  } catch (err) {
    next(err);
  }
};
