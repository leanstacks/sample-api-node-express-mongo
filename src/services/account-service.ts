import bcrypt from 'bcrypt';

import Account, { IAccount } from '../models/account';
import { logger } from '../utils/logger';

export class AccountExistsError extends Error {
  name = 'AccountExistsError';
  constructor(message: string) {
    super(message);
  }
}

export default class AccountService {
  async createOne(account: IAccount): Promise<IAccount> {
    logger.info('AccountService::createOne');
    // check unique username
    const existingAccount = await this.findOneByUsername(account.username);
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
  }

  async list(): Promise<IAccount[]> {
    logger.info('AccountService::list');
    const accounts = await Account.find();
    return accounts;
  }

  async findOne(id: string): Promise<IAccount> {
    logger.info('AccountService::findOne');
    const account = (await Account.findById(id)) as IAccount;
    return account;
  }

  async findOneByUsername(username: string): Promise<IAccount> {
    logger.info('AccountService::findOneByUsername');
    const account = (await Account.findOne({ username })) as IAccount;
    return account;
  }

  async authenticate(username: string, password: string): Promise<IAccount | null> {
    logger.info('AccountService::authenticate');
    const account = await this.findOneByUsername(username);
    if (account) {
      const isPasswordMatch = await bcrypt.compare(password, account.password);
      if (isPasswordMatch) {
        return account;
      }
    }
    return null;
  }

  async updateOne(id: string, account: IAccount): Promise<IAccount | null> {
    logger.info('AccountService::updateOne');
    const accountToUpdate = await Account.findById(id);
    if (accountToUpdate) {
      accountToUpdate.username = account.username;
      accountToUpdate.save();
    }
    return accountToUpdate;
  }

  async deleteOne(id: string): Promise<void> {
    logger.info('AccountService::deleteOne');
    await Account.findByIdAndDelete(id);
  }
}
