import { verify } from '../auth-strategy-basic';

import AccountService from '../../services/account-service';
jest.mock('../../services/account-service');
const mockedAccountService = jest.mocked(AccountService);

describe('Passport Basic Strategy', () => {
  const username = 'user@example.com';
  const password = 'StrongP@ssw0rd';
  const account = {
    id: '1',
    username,
    password,
    isActive: true,
    isLocked: false,
    invalidAuthenticationCount: 0,
  };
  const done = jest.fn();

  afterEach(() => {
    done.mockClear();
    mockedAccountService.authenticate.mockClear();
  });

  it('should call done with user when authentication successful', async () => {
    mockedAccountService.authenticate.mockResolvedValue(account);

    await verify(username, password, done);

    expect(done).toHaveBeenCalledWith(null, account);
  });

  it('should call done with false when authentication fails', async () => {
    mockedAccountService.authenticate.mockResolvedValue(null);

    await verify(username, 'incorrectPassword', done);

    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with error when an error occurs', async () => {
    const error = new Error('test error');
    mockedAccountService.authenticate.mockRejectedValue(error);

    await verify(username, password, done);

    expect(done).toHaveBeenCalledWith(error);
  });
});
