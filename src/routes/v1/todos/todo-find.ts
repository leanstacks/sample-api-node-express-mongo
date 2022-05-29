import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const findTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::findTodo');

    const todoService = new TodoService();
    const todo = await todoService.findOne(req?.params?.id);

    if (todo) {
      res.send(todo);
    } else {
      res.status(404).end();
    }
  } catch (err: unknown) {
    next(err);
  }
};
