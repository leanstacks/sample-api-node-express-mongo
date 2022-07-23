import request from 'supertest';

import AccountService from '../../../../services/account-service';
import JwtService from '../../../../services/jwt-service';
import app from '../../../../app';
import { accountFixture } from '../../../../__fixtures__/models';

jest.mock('../../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('DELETE /v1/accounts/:id', () => {
  let token: string;

  beforeEach(async () => {
    token = JwtService.createToken({ accountFixture });
    mockedAccountService.findOne.mockResolvedValueOnce(accountFixture);
  });

  afterEach(async () => {
    mockedAccountService.deleteOne.mockClear();
  });

  it('should require authentication', async () => {
    const res = await request(app).delete('/v1/accounts/1');

    expect(res.statusCode).toEqual(401);
  });

  it('should return status code 204', async () => {
    const res = await request(app).delete('/v1/accounts/1').auth(token, { type: 'bearer' });

    expect(res.statusCode).toEqual(204);
  });

  it('should return status code 500 when an error occurs', async () => {
    mockedAccountService.deleteOne.mockRejectedValue(new Error());

    const res = await request(app).delete('/v1/accounts/1').auth(token, { type: 'bearer' });

    expect(res.statusCode).toEqual(500);
  });

  it('should call AccountService to delete an account', async () => {
    const res = await request(app).delete('/v1/accounts/1').auth(token, { type: 'bearer' });

    expect(mockedAccountService.deleteOne).toHaveBeenCalledWith('1');
  });
});
