import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import TodoService from '../../../services/todo-service';
import { ITodo } from '../../../models/todo';

const validate = (input: ITodo): ITodo => {
  const schema = Joi.object({
    id: Joi.string(),
    title: Joi.string().required(),
    isComplete: Joi.boolean().required(),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateTodo');
    const validatedRequest = validate(req.body);

    const updatedTodo = await TodoService.updateOne(req.params.id, validatedRequest);

    if (updatedTodo) {
      res.send(updatedTodo);
    } else {
      res.status(404).end();
    }
  } catch (err: unknown) {
    next(err);
  }
};
