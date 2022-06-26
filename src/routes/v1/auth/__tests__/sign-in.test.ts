import request from 'supertest';

import app from '../../../../app';

import AccountService from '../../../../services/account-service';
jest.mock('../../../../services/account-service');

import JwtService from '../../../../services/jwt-service';
jest.mock('../../../../services/jwt-service');

import { accountFixture } from '../../../../__fixtures__/models';

const mockedAccountService = jest.mocked(AccountService);
const mockedJwtService = jest.mocked(JwtService);

describe('POST /v1/auth/signin', () => {
  const data = { username: accountFixture.username, password: accountFixture.password };

  afterEach(async () => {
    mockedAccountService.authenticate.mockClear();
    mockedJwtService.createToken.mockClear();
  });

  it('should return status code 200', async () => {
    mockedAccountService.authenticate.mockResolvedValue(accountFixture);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.body.access_token).not.toBeNull();
    expect(res.body.refresh_token).not.toBeNull();
    expect(res.body.expires_in).toEqual(3600);
    expect(res.body.token_type).toEqual('Bearer');
  });

  it('should call return status code 422 when request is invalid', async () => {
    const data = {};

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.authenticate).not.toHaveBeenCalled();
    expect(mockedJwtService.createToken).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should call return status code 400 when account not found', async () => {
    mockedAccountService.authenticate.mockResolvedValue(null);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.authenticate).toHaveBeenCalledWith(data.username, data.password);
    expect(mockedJwtService.createToken).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(400);
  });

  it('should call AccountService', async () => {
    mockedAccountService.authenticate.mockResolvedValue(accountFixture);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.authenticate).toHaveBeenCalledWith(data.username, data.password);
  });

  it('should call JwtService', async () => {
    mockedAccountService.authenticate.mockResolvedValue(accountFixture);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedJwtService.createToken).toHaveBeenCalledTimes(2);
  });
});
