import { MongoMemoryServer } from 'mongodb-memory-server';
import { Collection, MongoClient } from 'mongodb';

import { logger } from '../utils/logger';
import config from '../config/config';
import { Account } from './account-service';
import { Todo } from './todo-service';

interface Collections {
  accounts?: Collection<Account>;
  todos?: Collection<Todo>;
}

export const collections: Collections = {};

export const connectToDatabase = async (): Promise<void> => {
  logger.info('connecting to the database...');
  try {
    let connectionUrl = config.MONGO_URL;
    if (config.MONGO_INMEMORY === 'true') {
      logger.info('using in-memory MongoDB');
      const mongo = await MongoMemoryServer.create();
      connectionUrl = mongo.getUri();
    }
    const mongoClient = await MongoClient.connect(connectionUrl);
    const db = mongoClient.db(config.MONGO_DBNAME);

    collections.accounts = db.collection('accounts');
    collections.todos = db.collection('todos');
  } catch (err) {
    logger.error('Unable to connect to database.', err);
  }
};
