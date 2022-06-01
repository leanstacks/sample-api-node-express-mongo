import { NextFunction, Request, Response } from 'express';

import logger from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const listTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::listTodos');

    const todos = await TodoService.list();

    res.send(todos);
  } catch (err: unknown) {
    next(err);
  }
};
