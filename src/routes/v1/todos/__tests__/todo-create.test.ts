import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

import TodoService from '../../../../services/todo-service';
jest.mock('../../../../services/todo-service');

const mockedTodoService = jest.mocked(TodoService);

describe('POST /v1/todos', () => {
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
      invalidAuthenticationCount: 0,
    });
    token = JwtService.createToken({ account });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }

    mockedTodoService.createOne.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should require authentication', async () => {
    const data = { account: '629e461fdc7347786c5fa080', title: 'run tests' };

    const res = await request(app)
      .post('/v1/todos')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    const data = { account: '629e461fdc7347786c5fa080', title: 'run tests' };

    const res = await request(app)
      .post('/v1/todos')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
  });

  it('should call return status code 422 when request is invalid', async () => {
    const data = {};

    const res = await request(app)
      .post('/v1/todos')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.createOne).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should call TodoService', async () => {
    const data = { account: '629e461fdc7347786c5fa080', title: 'run tests' };
    const createdData = {
      id: 'a1',
      account: '629e461fdc7347786c5fa080',
      title: 'run tests',
      isComplete: false,
    };
    mockedTodoService.createOne.mockResolvedValue(createdData);

    const res = await request(app)
      .post('/v1/todos')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.createOne).toHaveBeenCalled();
    expect(res.body).toEqual({
      id: 'a1',
      account: '629e461fdc7347786c5fa080',
      title: 'run tests',
      isComplete: false,
    });
  });
});
