import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import { IAccount } from '../../../models/account';
import AccountService from '../../../services/account-service';

const validate = (input: IAccount): IAccount => {
  const schema = Joi.object({
    id: Joi.string(),
    username: Joi.string().email().required(),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateAccount');

    const validatedRequest = validate(req.body);

    const updatedAccount = await AccountService.updateOne(req?.params?.id, validatedRequest);

    if (updatedAccount) {
      res.send(updatedAccount);
    } else {
      res.status(404).end();
    }
  } catch (err: any) {
    next(err);
  }
};
