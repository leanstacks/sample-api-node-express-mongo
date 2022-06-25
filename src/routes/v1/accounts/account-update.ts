import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import { IAccount } from '../../../models/account';
import AccountService from '../../../services/account-service';

const validate = (input: IAccount): IAccount => {
  const schema = Joi.object({
    id: Joi.string(),
    username: Joi.string().email(),
    password: Joi.string()
      .min(12)
      .max(30)
      .pattern(new RegExp('[a-z]+'))
      .pattern(new RegExp('[A-Z]+'))
      .pattern(new RegExp('[0-9]+'))
      .pattern(new RegExp('[!@#$%^&*()]+')),
    isActive: Joi.boolean(),
    isLocked: Joi.boolean(),
  });
  const { value, error } = schema.validate(input, { abortEarly: false });
  if (error) {
    throw error;
  }
  return value;
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateAccount');

    const validatedRequest = validate(req.body);

    const updatedAccount = await AccountService.updateOne(req.params.id, validatedRequest);

    if (updatedAccount) {
      res.send(updatedAccount);
    } else {
      res.status(404).end();
    }
  } catch (err: any) {
    next(err);
  }
};
