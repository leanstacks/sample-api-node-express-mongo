import { ObjectId } from 'mongodb';

import { collections } from './database-service';
import { logger } from '../utils/logger';

export enum AccountType {
  CLIENT = 'client',
  USER = 'user',
}

export interface Account {
  _id?: ObjectId;
  type: AccountType;
  username: string;
  password: string;
  authenticationCode?: string;
  isActive: boolean;
}

export default class AccountService {
  findAccount = async (username: string, type: AccountType): Promise<Account | null> => {
    logger.info('AccountService::findAccount');
    const filter = {
      username,
      type,
    };
    const account: Account = (await collections.accounts?.findOne(filter)) as Account;
    return account;
  };

  authenticateClient = async (clientId: string, clientSecret: string): Promise<Account | null> => {
    logger.info('AccountService::authenticateClient');
    const account = await this.findAccount(clientId, AccountType.CLIENT);
    if (account) {
      // account found
      if (account.password === clientSecret) {
        // credentials match
        return account;
      }
    }

    return null;
  };
}
