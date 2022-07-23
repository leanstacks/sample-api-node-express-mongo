import request from 'supertest';

import TodoService from '../../../../services/todo-service';
import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';
import { accountFixture, todoFixture } from '../../../../__fixtures__/models';

jest.mock('../../../../services/todo-service');
jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);
const mockedTodoService = jest.mocked(TodoService);

describe('PUT /v1/todos/:id', () => {
  let token: string;

  beforeEach(async () => {
    // create an auth token for test requests
    token = JwtService.createToken({ account: accountFixture });
    // mock AccountService for auth token verification
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedTodoService.updateOne.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .put('/v1/todos/1')
      .send(todoFixture)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    mockedTodoService.updateOne.mockResolvedValueOnce(todoFixture);

    const res = await request(app)
      .put('/v1/todos/1')
      .auth(token, { type: 'bearer' })
      .send(todoFixture)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual(todoFixture);
  });

  it('should call return status code 422 when request is invalid', async () => {
    const data = {};

    const res = await request(app)
      .put('/v1/todos/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.updateOne).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should return status code 404 when not found', async () => {
    mockedTodoService.updateOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .put('/v1/todos/1')
      .auth(token, { type: 'bearer' })
      .send(todoFixture)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(404);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedTodoService.updateOne.mockRejectedValueOnce(new Error());

    const res = await request(app)
      .put('/v1/todos/1')
      .auth(token, { type: 'bearer' })
      .send(todoFixture)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.updateOne).toHaveBeenCalled();
    expect(res.statusCode).toEqual(500);
  });

  it('should call TodoService', async () => {
    mockedTodoService.updateOne.mockResolvedValueOnce(todoFixture);

    const res = await request(app)
      .put('/v1/todos/1')
      .auth(token, { type: 'bearer' })
      .send(todoFixture)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedTodoService.updateOne).toHaveBeenCalled();
  });
});
