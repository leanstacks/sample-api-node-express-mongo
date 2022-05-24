import Todo, { ITodo } from '../models/todo';
import { logger } from '../utils/logger';

export default class TodoService {
  async createOne(title: string): Promise<ITodo> {
    logger.debug('TodoService::createOne');
    const todo = new Todo({
      title,
      isComplete: false,
    });
    await todo.save();
    return todo;
  }

  async list(): Promise<ITodo[]> {
    logger.debug('TodoService::list');
    const todos = await Todo.find();
    return todos;
  }

  async findOne(id: string): Promise<ITodo> {
    logger.debug('TodoService::findOne');
    const todo = (await Todo.findById(id)) as ITodo;
    return todo;
  }

  async updateOne(id: string, todo: ITodo): Promise<ITodo> {
    logger.debug('TodoService::updateOne');
    const todoUpdated = (await Todo.findOneAndUpdate({ _id: id }, todo, { new: true })) as ITodo;
    return todoUpdated;
  }

  async deleteOne(id: string): Promise<void> {
    logger.debug('TodoService::deleteOne');
    await Todo.findByIdAndDelete(id);
    return;
  }
}
