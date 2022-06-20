import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

import TodoService from '../../../../services/todo-service';
import { IAccount } from '../../../../models/account';
jest.mock('../../../../services/todo-service');

const mockedTodoService = jest.mocked(TodoService);

describe('GET /v1/accounts/:id/todos', () => {
  let mongo: MongoMemoryServer;
  let account: IAccount;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    mongoose.connect(mongo.getUri());
  });

  beforeEach(async () => {
    account = await AccountService.createOne({
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

    mockedTodoService.listByAccount.mockClear();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should require authentication', async () => {
    const res = await request(app).get(`/v1/accounts/${account.id}/todos`);

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    const accountId: string = account.id?.toString() || '';
    const data = [{ id: '1', account: accountId, title: 'run tests', isComplete: false }];
    mockedTodoService.listByAccount.mockResolvedValueOnce(data);

    const res = await request(app)
      .get(`/v1/accounts/${account.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual(data);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedTodoService.listByAccount.mockRejectedValueOnce(new Error());

    const res = await request(app)
      .get(`/v1/accounts/${account.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(mockedTodoService.listByAccount).toHaveBeenCalled();
    expect(res.statusCode).toEqual(500);
  });

  it('should call TodoService', async () => {
    const accountId: string = account.id?.toString() || '';
    const data = [{ id: '1', account: accountId, title: 'run tests', isComplete: false }];
    mockedTodoService.listByAccount.mockResolvedValueOnce(data);

    const res = await request(app)
      .get(`/v1/accounts/${account.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(mockedTodoService.listByAccount).toHaveBeenCalledWith(accountId);
  });
});
