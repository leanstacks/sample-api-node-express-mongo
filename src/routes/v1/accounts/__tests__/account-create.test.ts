import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('POST /v1/accounts', () => {
  let token: string;
  const data = { username: 'test1@example.com', password: 'StrongP@ssw0rd' };
  const createdData = { id: '2', username: data.username, password: data.password };
  const accountData = { id: '1', username: 'user@example.com', password: 'StrongP@ssw0rd' };

  beforeEach(async () => {
    token = JwtService.createToken({ accountData });
    mockedAccountService.findOne.mockResolvedValueOnce(accountData);
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
    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
  });

  it('should call return status code 422 when request is invalid', async () => {
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

  it('should call AccountService to create an account', async () => {
    mockedAccountService.createOne.mockResolvedValue(createdData);

    const res = await request(app)
      .post('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.createOne).toHaveBeenCalledWith(data);
    expect(res.body).toEqual(createdData);
  });
});
