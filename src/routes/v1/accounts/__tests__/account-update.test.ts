import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';

jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('PUT /v1/accounts/:id', () => {
  let token: string;
  const accountData = { id: '1', username: 'user@example.com', password: 'StrongP@ssw0rd' };
  const data = { id: '2', username: 'test1@example.com' };
  const updatedData = { id: '2', username: data.username, password: 'StrongP@ssw0rd' };

  beforeEach(async () => {
    token = JwtService.createToken({ accountData });
    mockedAccountService.findOne.mockResolvedValueOnce(accountData);
  });

  afterEach(async () => {
    mockedAccountService.updateOne.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .put('/v1/accounts/1')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    mockedAccountService.updateOne.mockResolvedValue(updatedData);

    const res = await request(app)
      .put('/v1/accounts/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
  });

  it('should call AccountService to update an account', async () => {
    mockedAccountService.updateOne.mockResolvedValue(updatedData);

    const res = await request(app)
      .put('/v1/accounts/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.updateOne).toHaveBeenCalledWith('1', data);
    expect(res.body).toEqual(updatedData);
  });

  it('should return status code 422 when request is invalid', async () => {
    const data = {};

    const res = await request(app)
      .put('/v1/accounts/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(mockedAccountService.updateOne).not.toHaveBeenCalled();
    expect(res.statusCode).toEqual(422);
  });

  it('should return status code 404 when not found', async () => {
    mockedAccountService.updateOne.mockResolvedValue(null);

    const res = await request(app)
      .put('/v1/accounts/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(404);
  });

  it('should return status code 500 when an error occurs', async () => {
    mockedAccountService.updateOne.mockRejectedValue(new Error());

    const res = await request(app)
      .put('/v1/accounts/1')
      .auth(token, { type: 'bearer' })
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
  });
});
