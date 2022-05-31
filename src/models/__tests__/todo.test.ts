import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import Todo from '../todo';

describe('Todo Model', () => {
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
    const data = { title: 'run tests', isComplete: false };

    const todo = new Todo(data);
    await todo.save();
    expect(todo).not.toBeNull();
    expect(todo._id).not.toBeNull();
  });

  it('should have "id" in JSON', async () => {
    const data = { title: 'run tests', isComplete: false };

    const todo = new Todo(data);
    await todo.save();
    expect(todo).not.toBeNull();
    expect(todo.toJSON().id).not.toBeNull();
    expect(todo._id).toEqual(todo.toJSON().id);
  });

  it('should not have "_id" in JSON', async () => {
    const data = { title: 'run tests', isComplete: false };

    const todo = new Todo(data);
    await todo.save();
    expect(todo).not.toBeNull();
    expect(JSON.stringify(todo.toJSON())).not.toMatch(/_id/);
  });
});
