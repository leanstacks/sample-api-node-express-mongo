import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
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
    const token = jwtService.createAccessToken({
      username: req.body.client_id,
      password: req.body.client_secret,
    });
    res.send({
      access_token: token,
    });
  } catch (err) {
    next(err);
  }
};
