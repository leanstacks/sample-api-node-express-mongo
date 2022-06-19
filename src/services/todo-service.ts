import merge from 'lodash/merge';

import Todo, { ITodo } from '../models/todo';
import logger from '../utils/logger';

const createOne = async (todo: ITodo): Promise<ITodo> => {
  logger.debug('TodoService::createOne');
  return Todo.create(todo);
};

const list = async (): Promise<ITodo[]> => {
  logger.debug('TodoService::list');
  return Todo.find();
};

const listByAccount = async (accountId: string): Promise<ITodo[]> => {
  logger.debug('TodoService::listByAccount');
  return Todo.find({ account: accountId });
};

const findOne = async (id: string): Promise<ITodo | null> => {
  logger.debug('TodoService::findOne');
  const todo = (await Todo.findById(id)) as ITodo;
  return todo;
};

const updateOne = async (id: string, todo: ITodo): Promise<ITodo | null> => {
  logger.debug('TodoService::updateOne');
  const todoToUpdate = await Todo.findById(id);
  if (todoToUpdate) {
    merge(todoToUpdate, todo);
    await todoToUpdate.save();
  }
  return todoToUpdate;
};

const deleteOne = async (id: string): Promise<void> => {
  logger.debug('TodoService::deleteOne');
  await Todo.findByIdAndDelete(id);
  return;
};

export default {
  createOne,
  list,
  listByAccount,
  findOne,
  updateOne,
  deleteOne,
};
