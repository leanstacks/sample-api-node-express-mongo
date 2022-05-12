import { ObjectId } from 'mongodb';

import { collections } from './database-service';
import { logger } from '../utils/logger';

export interface Todo {
  _id?: ObjectId;
  title: string;
  isComplete: boolean;
}

export default class TodoService {
  collectionName = 'todos';

  async createOne(todo: { title: string }): Promise<Todo> {
    logger.debug('TodoService::createOne');
    const todoToCreate: Todo = {
      isComplete: false,
      title: todo.title,
    };
    await collections.todos?.insertOne(todoToCreate);

    return todoToCreate;
  }

  async list(): Promise<Todo[]> {
    logger.debug('TodoService::list');
    const todos = (await collections.todos?.find({}).toArray()) as Todo[];
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    logger.debug('TodoService::findOne');
    const todo: Todo = (await collections.todos?.findOne({ _id: new ObjectId(id) })) as Todo;
    return todo;
  }

  async updateOne(id: string, todo: Todo): Promise<Todo> {
    logger.debug('TodoService::updateOne');
    const todoToUpdate = todo;
    delete todoToUpdate._id;
    await collections.todos?.updateOne({ _id: new ObjectId(id) }, { $set: todoToUpdate });

    return await this.findOne(id);
  }

  async deleteOne(id: string): Promise<void> {
    logger.debug('TodoService::deleteOne');
    await collections.todos?.deleteOne({ _id: new ObjectId(id) });
    return;
  }
}
