import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

import { collections } from './database-service';
import { logger } from '../utils/logger';

export class AccountExistsError extends Error {
  name = 'AccountExistsError';
  constructor(message: string) {
    super(message);
  }
}

export class Account {
  constructor(public username: string, public password: string, public _id?: ObjectId) {}
}

export default class AccountService {
  async createOne(account: Account): Promise<Account> {
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
    await collections.accounts?.insertOne(account);

    return account;
  }

  async list(): Promise<Account[]> {
    logger.info('AccountService::list');

    const accounts = (await collections.accounts?.find({}).toArray()) as Account[];

    return accounts;
  }

  async findOne(id: string): Promise<Account | null> {
    logger.info('AccountService::findOne');
    const query = { _id: new ObjectId(id) };
    const account = (await collections.accounts?.findOne(query)) as Account;

    return account;
  }

  async findOneByUsername(username: string): Promise<Account | null> {
    logger.info('AccountService::findOneByUsername');
    const query = { username };
    const account = (await collections.accounts?.findOne(query)) as Account;
    return account;
  }

  async authenticate(username: string, password: string): Promise<Account | null> {
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

  async updateOne(id: string, account: Account): Promise<Account | null> {
    logger.info('AccountService::updateOne');
    delete account._id;
    const query = { _id: new ObjectId(id) };
    const result = await collections.accounts?.updateOne(query, { $set: account });
    logger.debug('update result', { result });

    return this.findOne(id);
  }

  async deleteOne(id: string): Promise<number> {
    logger.info('AccountService::deleteOne');
    const query = { _id: new ObjectId(id) };
    const result = await collections.accounts?.deleteOne(query);
    logger.debug('delete result', { result });

    return result ? result.deletedCount : 0;
  }
}
