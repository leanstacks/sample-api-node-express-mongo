import { verify } from '../auth-strategy-jwt';

import { accountFixture } from '../../tests/fixtures';
import AccountService from '../../services/account-service';
jest.mock('../../services/account-service');
const mockedAccountService = jest.mocked(AccountService);

describe('Passport JWT Strategy', () => {
  const payload = { account: accountFixture };
  const done = jest.fn();

  afterEach(() => {
    done.mockClear();
    mockedAccountService.findOne.mockClear();
  });

  it('should call done with user when authentication successful', async () => {
    mockedAccountService.findOne.mockResolvedValue(accountFixture);

    await verify(payload, done);

    expect(mockedAccountService.findOne).toHaveBeenCalledWith(payload.account.id);
    expect(done).toHaveBeenCalledWith(null, accountFixture);
  });

  it('should call done with false when authentication fails', async () => {
    mockedAccountService.findOne.mockResolvedValue(null);

    await verify(payload, done);

    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with false when payload null', async () => {
    mockedAccountService.findOne.mockResolvedValue(null);

    await verify(null, done);

    expect(mockedAccountService.findOne).toHaveBeenCalledWith(undefined);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with false when payload empty', async () => {
    mockedAccountService.findOne.mockResolvedValue(null);

    await verify({}, done);

    expect(mockedAccountService.findOne).toHaveBeenCalledWith(undefined);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with false when payload account has no id attribute', async () => {
    mockedAccountService.findOne.mockResolvedValue(null);
    const badPayload = {
      account: {
        username: 'user@example.com',
        password: 'StrongP@ssw0rd',
      },
    };

    await verify(badPayload, done);

    expect(mockedAccountService.findOne).toHaveBeenCalledWith(undefined);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with error when an error occurs', async () => {
    const error = new Error('test error');
    mockedAccountService.findOne.mockRejectedValue(error);

    await verify(payload, done);

    expect(done).toHaveBeenCalledWith(error);
  });
});
