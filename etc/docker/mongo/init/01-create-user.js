const dbName = 'todo_db';

db = db.getSiblingDB(dbName);

db.createUser({
  user: 'todoapp',
  pwd: 'todopass',
  roles: [
    {
      role: 'readWrite',
      db: dbName,
    },
  ],
});
