import request from 'supertest';

import AccountService from '../../../../services/account-service';
import TodoService from '../../../../services/todo-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';
import { accountFixture, todoFixture } from '../../../../tests/fixtures';

jest.mock('../../../../services/todo-service');
jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);
const mockedTodoService = jest.mocked(TodoService);

describe('POST /v1/todos', () => {
  let token: string;
  const data = { account: todoFixture.account, title: todoFixture.title };

  beforeEach(async () => {
    // create an auth token for test requests
    token = JwtService.createToken({ account: accountFixture });
    // mock AccountService for auth token verification
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);

    // mock TodoService function
    mockedTodoService.createOne.mockResolvedValue(todoFixture);
  });

  afterEach(async () => {
    mockedTodoService.createOne.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .post('/v1/todos')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
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
    mockedTodoService.createOne.mockResolvedValue(todoFixture);

    const res = await request(app)
      .post('/v1/todos')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.createOne).toHaveBeenCalled();
    expect(res.body).toEqual(todoFixture);
  });
});
