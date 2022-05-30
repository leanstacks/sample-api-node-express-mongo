import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import logger from '../../../utils/logger';
import TodoService from '../../../services/todo-service';
import { ITodo } from '../../../models/todo';

const validate = (input: ITodo): ITodo => {
  const schema = Joi.object({
    title: Joi.string().required(),
    isComplete: Joi.boolean().default(false),
  });
  const { value, error } = schema.validate(input);
  if (error) {
    throw error;
  }
  return value;
};

export const createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createTodo');

    const validatedRequest = validate(req.body);

    const todoService = new TodoService();
    const createdTodo = await todoService.createOne(validatedRequest);

    res.send(createdTodo);
  } catch (err: unknown) {
    next(err);
  }
};
