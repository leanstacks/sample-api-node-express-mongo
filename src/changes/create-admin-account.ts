import { ChangeFunction } from './evolution';
import AccountService from '../services/account-service';
import { IAccount } from '../models/account';
import logger from '../utils/logger';

const createAdminUser: ChangeFunction = async (): Promise<void> => {
  logger.debug('> ChangeFunction::createAdminUser');
  const username = 'admin@example.com';
  const password = 'StrongPassword0!';
  let account = await AccountService.findOneByUsername(username);
  if (!account) {
    account = await AccountService.createOne({ username, password } as IAccount);
    logger.info(`ADMIN ACCOUNT CREATED: username:${username} password:${password}`);
  }
  logger.debug('< ChangeFunction::createAdminUser');
  return;
};

export default createAdminUser;
