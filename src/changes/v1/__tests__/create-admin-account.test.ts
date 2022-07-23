import createAdminAccount from '../create-admin-account';

import AccountService from '../../../services/account-service';
import { accountFixture } from '../../../__fixtures__/models';

jest.mock('../../../services/account-service');

const mockedAccountService = jest.mocked(AccountService);

describe('createAdminUser', () => {
  afterEach(() => {
    mockedAccountService.findOneByUsername.mockClear();
    mockedAccountService.createOne.mockClear();
  });

  it('should create Account', async () => {
    mockedAccountService.findOneByUsername.mockResolvedValueOnce(null);
    mockedAccountService.createOne.mockResolvedValueOnce(accountFixture);

    await createAdminAccount();

    expect(mockedAccountService.findOneByUsername).toHaveBeenCalledTimes(1);
    expect(mockedAccountService.createOne).toHaveBeenCalledTimes(1);
    expect(mockedAccountService.createOne).toHaveBeenLastCalledWith({
      username: 'sysadmin@example.com',
      password: 'StrongPassword0!',
    });
  });

  it('should not create Account when one already exists', async () => {
    mockedAccountService.findOneByUsername.mockResolvedValueOnce(accountFixture);

    await createAdminAccount();

    expect(mockedAccountService.findOneByUsername).toHaveBeenCalledTimes(1);
    expect(mockedAccountService.createOne).not.toHaveBeenCalled();
  });
});
