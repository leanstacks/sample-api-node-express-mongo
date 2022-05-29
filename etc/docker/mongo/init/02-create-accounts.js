const dbName = 'todo_db';
const collectionName = 'accounts';

db = db.getSiblingDB(dbName);
db.createCollection(collectionName);

db.getCollection(collectionName).insertMany([
  {
    username: 'user@example.com',
    password: 'StrongPassword0!',
  },
]);
