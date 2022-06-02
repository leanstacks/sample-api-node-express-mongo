import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import config from '../../../config/config';
import JwtService from '../../../services/jwt-service';
import AccountService from '../../../services/account-service';

interface TokenRequest {
  grant_type: 'refresh_token';
  refresh_token: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
}

const validate = (input: TokenRequest): TokenRequest => {
  const schema = Joi.object({
    grant_type: Joi.string().required().valid('refresh_token'),
    refresh_token: Joi.string().required(),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const createToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createToken');

    const validatedRequest = validate(req.body);

    const payload = JwtService.verifyToken(validatedRequest.refresh_token);

    const account = await AccountService.findOne(payload.account.id);

    if (account) {
      const accessToken = JwtService.createToken({
        account,
      });

      res.send({
        access_token: accessToken,
        expires_in: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token: validatedRequest.refresh_token,
        token_type: 'Bearer',
      } as TokenResponse);
    }
  } catch (err) {
    next(err);
  }
};
