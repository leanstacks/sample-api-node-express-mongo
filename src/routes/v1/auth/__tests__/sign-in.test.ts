import request from 'supertest';

import app from '../../../../app';

import AccountService from '../../../../services/account-service';
jest.mock('../../../../services/account-service');

import JwtService from '../../../../services/jwt-service';
jest.mock('../../../../services/jwt-service');

const mockedAccountService = jest.mocked(AccountService);
const mockedJwtService = jest.mocked(JwtService);

describe('POST /v1/auth/signin', () => {
  afterEach(async () => {
    mockedAccountService.authenticate.mockClear();
    mockedJwtService.createToken.mockClear();
  });

  it('should return status code 200', async () => {
    const data = { username: 'user@example.com', password: 'StrongPassword0!' };
    const account = {
      id: '1',
      username: data.username,
      password: data.password,
      isActive: true,
      isLocked: false,
    };
    mockedAccountService.authenticate.mockResolvedValue(account);

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
    const data = { username: 'user@example.com', password: 'StrongPassword0!' };
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
    const data = { username: 'user@example.com', password: 'StrongPassword0!' };
    const account = {
      id: '1',
      username: data.username,
      password: data.password,
      isActive: true,
      isLocked: false,
    };
    mockedAccountService.authenticate.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.authenticate).toHaveBeenCalledWith(data.username, data.password);
  });

  it('should call JwtService', async () => {
    const data = { username: 'user@example.com', password: 'StrongPassword0!' };
    const account = {
      id: '1',
      username: data.username,
      password: data.password,
      isActive: true,
      isLocked: false,
    };
    mockedAccountService.authenticate.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/signin')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedJwtService.createToken).toHaveBeenCalledTimes(2);
  });
});
