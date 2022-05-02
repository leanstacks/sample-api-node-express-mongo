const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const { MONGO_DBNAME, MONGO_INMEMORY, MONGO_URL } = require('../config/config');

let database = null;

const startDatabase = async () => {
  console.log('starting database');
  try {
    let mongo = null;
    if (MONGO_INMEMORY === 'true') {
      mongo = await MongoMemoryServer.create();
    }
    const connectionUrl = mongo ? mongo.getUri() : MONGO_URL;
    console.log(`connecting to database at: ${connectionUrl}`);
    const connection = await MongoClient.connect(connectionUrl);
    database = connection.db(MONGO_DBNAME);
  } catch (err) {
    console.log('Unable to connect to database.', err);
  }
};

const getDatabase = async () => {
  if (!database) {
    await startDatabase();
  }
  return database;
};

module.exports = {
  getDatabase,
  startDatabase,
};
