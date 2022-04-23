const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { startDatabase } = require('./database/mongo');
const v1 = require('./routes/v1');
const defaultRoutes = require('./routes');
const Todos = require('./database/todos');

// create the Express app
const app = express();

// configure Express middleware
// Helmet - enhances API security
app.use(helmet());
// JSON - built-in middleware to parse JSON bodies into JS objects
app.use(express.json());
// CORS - enable cross-origin support
app.use(cors());
// Morgan - logging
app.use(morgan('combined'));

// configure Express routes / handlers
// api version1 routes
app.use('/v1', v1);

// default routes
app.use('*', defaultRoutes);

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  // boostrap the database
  await Todos.create({
    title: 'Learn to use in-memory MongoDB!',
  });

  // start the Express server
  app.listen(3001, () => {
    console.log('listening on port 3001');
  });
});
