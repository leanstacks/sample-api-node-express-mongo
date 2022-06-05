import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import logger from '../utils/logger';
import config from '../config/config';

export const connectToDatabase = async (): Promise<void> => {
  logger.info('connecting to the database...');
  try {
    let connectionUrl = config.MONGO_URL;
    if (config.MONGO_INMEMORY) {
      logger.info('using in-memory MongoDB');
      const mongo = await MongoMemoryServer.create();
      connectionUrl = mongo.getUri();
    }
    mongoose.connect(connectionUrl);
  } catch (err) {
    logger.error('Unable to connect to database.', err);
  }
};
