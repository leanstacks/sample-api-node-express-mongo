import { NextFunction, Request, Response } from 'express';

import { logger } from '../../utils/logger';
import TodoService from '../../services/todo-service';

export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::deleteTodo');
    const todoService = new TodoService();
    await todoService.deleteOne(req.params.id);

    res.status(204);
    res.end();
  } catch (err) {
    next(err);
  }
};
