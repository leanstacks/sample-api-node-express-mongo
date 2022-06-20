import request from 'supertest';

import app from '../../../../app';

import AccountService from '../../../../services/account-service';
jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('POST /v1/auth/signup', () => {
  const data = { username: 'user@example.com', password: 'StrongPassword0!' };
  const account = {
    id: '1',
    username: 'user@example.com',
    password: 'StrongPassword0!',
    isActive: true,
    isLocked: false,
  };

  afterEach(async () => {
    mockedAccountService.createOne.mockClear();
  });

  it('should return status code 200', async () => {
    mockedAccountService.createOne.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/signup')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(account.id);
    expect(res.body.username).toEqual(account.username);
  });

  it('should call return status code 422 when request is invalid', async () => {
    const invalidRequest = {};

    const res = await request(app)
      .post('/v1/auth/signup')
      .send(invalidRequest)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.createOne).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should call return status code 500 when an error occurs', async () => {
    mockedAccountService.createOne.mockRejectedValue(new Error());

    const res = await request(app)
      .post('/v1/auth/signup')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
  });

  it('should call AccountService', async () => {
    mockedAccountService.createOne.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/signup')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.createOne).toHaveBeenCalledWith(data);
  });
});
