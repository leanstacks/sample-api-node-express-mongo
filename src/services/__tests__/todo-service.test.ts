import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ITodo } from '../../models/todo';
import TodoService from '../todo-service';

describe('TodoService', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    mongoose.connect(mongo.getUri());
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should create a Todo', async () => {
    const todo: ITodo = {
      title: 'run tests',
      isComplete: false,
    };
    const todoService = new TodoService();

    const createdTodo = await todoService.createOne(todo);
    expect(createdTodo.title).toEqual(todo.title);
    expect(createdTodo.isComplete).toEqual(todo.isComplete);
    expect(createdTodo.id).not.toBeNull();

    const foundTodo = await todoService.findOne(createdTodo.id?.toString() || '');
    expect(foundTodo).not.toBeNull();
    expect(foundTodo.title).toEqual(todo.title);
    expect(foundTodo.isComplete).toEqual(todo.isComplete);
  });

  it('should list all Todos', async () => {
    const todoService = new TodoService();

    let todos = await todoService.list();
    expect(todos.length).toEqual(0);

    await todoService.createOne({ title: 'test', isComplete: false });
    await todoService.createOne({ title: 'test2', isComplete: true });

    todos = await todoService.list();
    expect(todos.length).toEqual(2);
  });

  it('should find a Todo by id', async () => {
    const todoService = new TodoService();

    const todo = await todoService.createOne({ title: 'test', isComplete: false });
    expect(todo.id).not.toBeNull();

    const foundTodo = await todoService.findOne(todo.id?.toString() || '');
    expect(foundTodo).not.toBeNull();
    expect(foundTodo.id).toEqual(todo.id);
  });

  it('should return null when searching for non-existent id', async () => {
    const todoService = new TodoService();

    const todo = await todoService.findOne('doesNotExist');
    expect(todo).toBeNull();
  });

  it('should update a Todo', async () => {
    const todoService = new TodoService();

    const todo = await todoService.createOne({ title: 'test', isComplete: false });
    expect(todo.id).not.toBeNull();
    expect(todo.title).toEqual('test');

    todo.title = 'updated';
    const updatedTodo = await todoService.updateOne(todo.id?.toString() || '', todo);
    expect(updatedTodo).not.toBeNull();
    expect(updatedTodo.title).toEqual('updated');
  });

  it('should return null when updating a non-existent id', async () => {
    const todoService = new TodoService();

    const todo = await todoService.updateOne('doesNotExist', { title: 'cant find me', isComplete: true });
    expect(todo).toBeNull();
  });

  it('should delete a Todo', async () => {
    const todoService = new TodoService();

    const todo = await todoService.createOne({ title: 'test', isComplete: false });
    expect(todo.id).not.toBeNull();

    await todoService.deleteOne(todo.id?.toString() || '');

    const deletedTodo = await todoService.findOne(todo.id?.toString() || '');
    expect(deletedTodo).toBeNull();
  });
});
