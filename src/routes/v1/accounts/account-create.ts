import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import AccountService from '../../../services/account-service';
import { IAccount } from '../../../models/account';

const validate = (input: IAccount): IAccount => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{12,30}$'))
      .pattern(new RegExp('[a-z]+'))
      .pattern(new RegExp('[A-Z]+'))
      .pattern(new RegExp('[0-9]+'))
      .pattern(new RegExp('[!@#$%^&*()]+')),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createAccount');

    const validatedRequest = validate(req.body);

    const accountService = new AccountService();
    const account = await accountService.createOne(validatedRequest);

    res.send(account);
  } catch (err: any) {
    next(err);
  }
};
