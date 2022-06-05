import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

import TodoService from '../../../../services/todo-service';
jest.mock('../../../../services/todo-service');

const mockedTodoService = jest.mocked(TodoService);

describe('GET /v1/todos', () => {
  let mongo: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    mongoose.connect(mongo.getUri());
  });

  beforeEach(async () => {
    const account = await AccountService.createOne({ username: 'user@example.com', password: 'Iamagoodpassword1!' });
    token = JwtService.createToken({ account });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    mockedTodoService.list.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should require authentication', async () => {
    const res = await request(app).get('/v1/todos');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    const data = [{ id: '1', title: 'run tests', isComplete: false }];
    mockedTodoService.list.mockResolvedValueOnce(data);

    const res = await request(app).get('/v1/todos').auth(token, { type: 'bearer' }).set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual(data);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedTodoService.list.mockRejectedValueOnce(new Error());

    const res = await request(app).get('/v1/todos').auth(token, { type: 'bearer' }).set('Accept', 'application/json');

    expect(mockedTodoService.list).toHaveBeenCalled();
    expect(res.statusCode).toEqual(500);
  });

  it('should call TodoService', async () => {
    const data = [{ id: '1', title: 'run tests', isComplete: false }];
    mockedTodoService.list.mockResolvedValueOnce(data);

    const res = await request(app).get('/v1/todos').auth(token, { type: 'bearer' }).set('Accept', 'application/json');

    expect(mockedTodoService.list).toHaveBeenCalled();
  });
});
