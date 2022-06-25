import { verify } from '../auth-strategy-basic';

import { accountFixture } from '../../tests/fixtures';
import AccountService from '../../services/account-service';
jest.mock('../../services/account-service');
const mockedAccountService = jest.mocked(AccountService);

describe('Passport Basic Strategy', () => {
  const done = jest.fn();

  afterEach(() => {
    done.mockClear();
    mockedAccountService.authenticate.mockClear();
  });

  it('should call done with user when authentication successful', async () => {
    mockedAccountService.authenticate.mockResolvedValue(accountFixture);

    await verify(accountFixture.username, accountFixture.password, done);

    expect(done).toHaveBeenCalledWith(null, accountFixture);
  });

  it('should call done with false when authentication fails', async () => {
    mockedAccountService.authenticate.mockResolvedValue(null);

    await verify(accountFixture.username, 'incorrectPassword', done);

    expect(done).toHaveBeenCalledWith(null, false);
  });

  it('should call done with error when an error occurs', async () => {
    const error = new Error('test error');
    mockedAccountService.authenticate.mockRejectedValue(error);

    await verify(accountFixture.username, accountFixture.password, done);

    expect(done).toHaveBeenCalledWith(error);
  });
});
