import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

import TodoService from '../../../../services/todo-service';
jest.mock('../../../../services/todo-service');

const mockedTodoService = jest.mocked(TodoService);

describe('DELETE /v1/todos/:id', () => {
  let mongo: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    mongoose.connect(mongo.getUri());
  });

  beforeEach(async () => {
    const account = await AccountService.createOne({
      username: 'user@example.com',
      password: 'Iamagoodpassword1!',
      isActive: true,
      isLocked: false,
    });
    token = JwtService.createToken({ account });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    mockedTodoService.deleteOne.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should require authentication', async () => {
    const res = await request(app).delete('/v1/todos/1');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 204', async () => {
    const res = await request(app).delete('/v1/todos/1').auth(token, { type: 'bearer' });

    expect(res.statusCode).toEqual(204);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedTodoService.deleteOne.mockRejectedValueOnce(new Error());

    const res = await request(app).delete('/v1/todos/1').auth(token, { type: 'bearer' });

    expect(mockedTodoService.deleteOne).toHaveBeenCalled();
    expect(res.statusCode).toEqual(500);
  });

  it('should call TodoService', async () => {
    const res = await request(app).delete('/v1/todos/1').auth(token, { type: 'bearer' });

    expect(mockedTodoService.deleteOne).toHaveBeenCalled();
    expect(res.statusCode).toEqual(204);
  });
});
