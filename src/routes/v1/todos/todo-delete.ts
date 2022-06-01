import { NextFunction, Request, Response } from 'express';

import logger from '../../../utils/logger';
import TodoService from '../../../services/todo-service';

export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('handler::deleteTodo');

    await TodoService.deleteOne(req.params.id);

    res.status(204).end();
  } catch (err: unknown) {
    next(err);
  }
};
