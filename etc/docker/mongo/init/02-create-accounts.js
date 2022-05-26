const dbName = 'todo_db';
const collectionName = 'accounts';

db = db.getSiblingDB(dbName);
db.createCollection(collectionName);

db.getCollection(collectionName).insertMany([
  {
    type: 'client',
    username: 'clientId',
    password: 'clientSecret',
  },
  {
    type: 'user',
    username: 'joe.mailbot@gmail.com',
    password: 'logmein',
  },
]);
