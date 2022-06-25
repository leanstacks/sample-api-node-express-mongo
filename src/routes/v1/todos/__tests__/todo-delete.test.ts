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

describe('DELETE /v1/todos/:id', () => {
  let token: string;

  beforeEach(async () => {
    // create an auth token for test requests
    token = JwtService.createToken({ account: accountFixture });
    // mock AccountService for auth token verification
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedTodoService.deleteOne.mockClear();
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
