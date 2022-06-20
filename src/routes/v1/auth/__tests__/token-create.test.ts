import request from 'supertest';

import app from '../../../../app';

import AccountService from '../../../../services/account-service';
jest.mock('../../../../services/account-service');

import JwtService from '../../../../services/jwt-service';
jest.mock('../../../../services/jwt-service');

const mockedAccountService = jest.mocked(AccountService);
const mockedJwtService = jest.mocked(JwtService);

describe('POST /v1/auth/token', () => {
  const data = { grant_type: 'refresh_token', refresh_token: 'abc123' };
  const account = {
    id: '1',
    username: 'user@example.com',
    password: 'StrongPassword0!',
    isActive: true,
    isLocked: false,
  };

  afterEach(async () => {
    mockedAccountService.findOne.mockClear();
    mockedJwtService.verifyToken.mockClear();
    mockedJwtService.createToken.mockClear();
  });

  it('should return status code 200', async () => {
    mockedJwtService.verifyToken.mockReturnValue({ account });
    mockedAccountService.findOne.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/token')
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
      .post('/v1/auth/token')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedJwtService.verifyToken).not.toHaveBeenCalled();
    expect(mockedAccountService.findOne).not.toHaveBeenCalled();
    expect(mockedJwtService.createToken).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should call JwtService to verify the refresh token', async () => {
    const res = await request(app)
      .post('/v1/auth/token')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedJwtService.verifyToken).toHaveBeenCalledWith(data.refresh_token);
  });

  it('should call AccountService to find the account', async () => {
    mockedAccountService.findOne.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/token')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.findOne).toHaveBeenCalledWith(account.id);
  });

  it('should call JwtService to create an access token', async () => {
    mockedAccountService.findOne.mockResolvedValue(account);

    const res = await request(app)
      .post('/v1/auth/token')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedJwtService.createToken).toHaveBeenCalledWith({ account });
  });
});
