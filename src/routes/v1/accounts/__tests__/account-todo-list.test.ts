import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

import TodoService from '../../../../services/todo-service';
import { IAccount } from '../../../../models/account';
import { accountFixture, todosFixture } from '../../../../tests/fixtures';

jest.mock('../../../../services/todo-service');
jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);
const mockedTodoService = jest.mocked(TodoService);

describe('GET /v1/accounts/:id/todos', () => {
  let token: string;

  beforeEach(async () => {
    // create an auth token for test requests
    token = JwtService.createToken({ account: accountFixture });
    // mock AccountService for auth token verification
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedTodoService.listByAccount.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app).get(`/v1/accounts/${accountFixture.id}/todos`);

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    mockedTodoService.listByAccount.mockResolvedValueOnce(todosFixture);

    const res = await request(app)
      .get(`/v1/accounts/${accountFixture.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual(todosFixture);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedTodoService.listByAccount.mockRejectedValueOnce(new Error());

    const res = await request(app)
      .get(`/v1/accounts/${accountFixture.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(mockedTodoService.listByAccount).toHaveBeenCalled();
    expect(res.statusCode).toEqual(500);
  });

  it('should call TodoService', async () => {
    mockedTodoService.listByAccount.mockResolvedValueOnce(todosFixture);

    const res = await request(app)
      .get(`/v1/accounts/${accountFixture.id}/todos`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(mockedTodoService.listByAccount).toHaveBeenCalledWith(accountFixture.id);
  });
});
