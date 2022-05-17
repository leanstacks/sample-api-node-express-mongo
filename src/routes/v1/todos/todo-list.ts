import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const listTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::listTodos');
    const todoService = new TodoService();
    const todos = await todoService.list();
    res.send(todos);
  } catch (err) {
    next(err);
  }
};
