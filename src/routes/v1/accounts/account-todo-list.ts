import { NextFunction, Request, Response } from 'express';

import logger from '../../../utils/logger';
import TodoService from '../../../services/todo-service';
import { IAccount } from '../../../models/account';
import { ITodo } from '../../../models/todo';

export const listTodosByAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info('handler::listTodosByAccount');

    let todos: ITodo[] = [];

    const account: IAccount = req.user as IAccount;
    if (account && account.id) {
      todos = await TodoService.listByAccount(account.id.toString());
    }

    res.send(todos);
  } catch (err: any) {
    next(err);
  }
};
