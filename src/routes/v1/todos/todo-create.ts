import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::createTodo');
    const todoService = new TodoService();
    const createdTodo = await todoService.createOne(req?.body?.title);
    res.send(createdTodo);
  } catch (err) {
    next(err);
  }
};
