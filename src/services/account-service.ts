import { ObjectId } from 'mongodb';

import { collections } from './database-service';
import { logger } from '../utils/logger';

export enum AccountType {
  CLIENT = 'client',
  USER = 'user',
}

export class Account {
  constructor(public type: AccountType, public username: string, public password: string, public _id?: ObjectId) {}
}

export default class AccountService {
  async createOne(account: Account): Promise<Account> {
    logger.info('AccountService::createOne');
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
