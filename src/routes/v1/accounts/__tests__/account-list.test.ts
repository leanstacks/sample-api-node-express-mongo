import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';
import { accountFixture } from '../../../../__fixtures__/models';

jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('GET /v1/accounts/:id', () => {
  let token: string;

  beforeEach(async () => {
    token = JwtService.createToken({ accountFixture });
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedAccountService.list.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app).get('/v1/accounts').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 200', async () => {
    mockedAccountService.list.mockResolvedValue([accountFixture]);

    const res = await request(app)
      .get('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual([accountFixture]);
  });

  it('should return status code 500 when an error occurs', async () => {
    mockedAccountService.list.mockRejectedValue(new Error());

    const res = await request(app)
      .get('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
  });

  it('should call AccountService to list accounts', async () => {
    mockedAccountService.list.mockResolvedValue([accountFixture]);

    const res = await request(app)
      .get('/v1/accounts')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json');

    expect(mockedAccountService.list).toHaveBeenCalled();
  });
});
