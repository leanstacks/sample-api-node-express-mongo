import { ChangeFunction } from '../evolution';
import AccountService from '../../services/account-service';
import { IAccount } from '../../models/account';
import logger from '../../utils/logger';

const createAdminAccount: ChangeFunction = async (): Promise<void> => {
  logger.debug('ChangeFunction::createAdminAccount');
  const username = 'sysadmin@example.com';
  const password = 'StrongPassword0!';
  let account = await AccountService.findOneByUsername(username);
  if (!account) {
    account = await AccountService.createOne({ username, password } as IAccount);
    logger.info(`SYSADMIN ACCOUNT CREATED: username:${username} password:${password}`);
  }
  return;
};

export default createAdminAccount;
