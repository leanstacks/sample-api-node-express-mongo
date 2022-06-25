import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';
import { accountFixture } from '../../../../tests/fixtures';

jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('POST /v1/accounts', () => {
  let token: string;
  const data = { username: accountFixture.username, password: accountFixture.password };

  beforeEach(async () => {
    token = JwtService.createToken({ account: accountFixture });
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedAccountService.createOne.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .post('/v1/accounts')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    mockedAccountService.createOne.mockResolvedValue(accountFixture);

    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
  });

  it('should call AccountService to create an account', async () => {
    mockedAccountService.createOne.mockResolvedValue(accountFixture);

    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.createOne).toHaveBeenCalledWith(data);
    expect(res.body).toEqual(accountFixture);
  });

  it('should return status code 422 when request is invalid', async () => {
    const data = {};

    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.createOne).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should return status code 500 when an error occurs', async () => {
    mockedAccountService.createOne.mockRejectedValue(new Error());

    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
  });
});
