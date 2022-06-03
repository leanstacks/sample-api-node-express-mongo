import bcrypt from 'bcrypt';

import Account, { IAccount } from '../models/account';
import logger from '../utils/logger';

export class AccountExistsError extends Error {
  name = 'AccountExistsError';
  constructor(message: string) {
    super(message);
  }
}

const createOne = async (account: IAccount): Promise<IAccount> => {
  logger.info('AccountService::createOne');
  // check unique username
  const existingAccount = await findOneByUsername(account.username);
  if (existingAccount) {
    throw new AccountExistsError('Username in use');
  }

  // hash password
  const passwordHash = await bcrypt.hash(account.password, 10);
  account.password = passwordHash;

  // save account
  const newAccount = new Account(account);
  await newAccount.save();

  return newAccount;
};

const list = async (): Promise<IAccount[]> => {
  logger.info('AccountService::list');
  const accounts = await Account.find();
  return accounts;
};

const findOne = async (id: string): Promise<IAccount | null> => {
  logger.info('AccountService::findOne');
  const account = (await Account.findById(id)) as IAccount;
  return account;
};

const findOneByUsername = async (username: string): Promise<IAccount | null> => {
  logger.info('AccountService::findOneByUsername');
  const account = (await Account.findOne({ username })) as IAccount;
  return account;
};

const authenticate = async (username: string, password: string): Promise<IAccount | null> => {
  logger.info('AccountService::authenticate');
  const account = await findOneByUsername(username);
  if (account) {
    const isPasswordMatch = await bcrypt.compare(password, account.password);
    if (isPasswordMatch) {
      return account;
    }
  }
  return null;
};

const updateOne = async (id: string, account: IAccount): Promise<IAccount | null> => {
  logger.info('AccountService::updateOne');
  try {
    const accountToUpdate = await Account.findById(id);
    if (accountToUpdate) {
      accountToUpdate.username = account.username;
      await accountToUpdate.save();
    }
    return accountToUpdate;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate')) {
      throw new AccountExistsError('Username in use');
    }
    throw err;
  }
};

const deleteOne = async (id: string): Promise<void> => {
  logger.info('AccountService::deleteOne');
  await Account.findByIdAndDelete(id);
};

export default {
  createOne,
  list,
  findOne,
  findOneByUsername,
  authenticate,
  updateOne,
  deleteOne,
};
