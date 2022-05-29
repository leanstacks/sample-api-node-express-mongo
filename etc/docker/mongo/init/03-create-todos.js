const dbName = 'todo_db';
const collectionName = 'todos';

db = db.getSiblingDB(dbName);
db.createCollection(collectionName);

db.getCollection(collectionName).insertMany([
  {
    title: 'Buy bread',
    isComplete: false,
  },
  {
    title: 'Wash car',
    isComplete: true,
  },
]);
