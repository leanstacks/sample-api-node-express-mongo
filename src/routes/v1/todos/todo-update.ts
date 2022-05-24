import { NextFunction, Request, Response } from 'express';

import { logger } from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('handler::updateTodo');
    const todo = req.body;
    const todoService = new TodoService();
    const updatedTodo = await todoService.updateOne(req.params.id, todo);

    if (updatedTodo) {
      res.send(updatedTodo);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
};
