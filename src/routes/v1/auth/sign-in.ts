import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import config from '../../../config/config';
import AccountService from '../../../services/account-service';
import JwtService from '../../../services/jwt-service';

interface SignInRequest {
  username: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
}

const validate = (input: SignInRequest): SignInRequest => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::signIn');

    const validatedRequest = validate(req.body);

    const account = await AccountService.authenticate(
      validatedRequest.username,
      validatedRequest.password,
    );
    if (account) {
      const access_token = JwtService.createToken({
        account,
      });
      const refresh_token = JwtService.createToken(
        {
          account,
        },
        {
          expiresIn: config.JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      );

      res.send({
        access_token,
        expires_in: config.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token,
        token_type: 'Bearer',
      } as SignInResponse);
    } else {
      res.status(400).end();
    }
  } catch (err: any) {
    next(err);
  }
};
