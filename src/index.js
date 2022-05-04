const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const loggingMiddleware = require('./middleware/logging');
const logger = require('./utils/logger');
const { SERVER_PORT } = require('./config/config');
const { startDatabase } = require('./database/mongo');
const v1 = require('./routes/v1');
const baseRoutes = require('./routes');
const { errorHandler, logErrors } = require('./middleware/errors');

// create the Express app
const app = express();

// configure Express middleware
// Helmet - enhances API security
app.use(helmet());
// JSON - built-in middleware to parse JSON bodies into JS objects
app.use(express.json());
// CORS - enable cross-origin support
app.use(cors());
// Logging - log HTTP events
app.use(loggingMiddleware);

// configure Express routes / handlers
// api version1 routes
app.use('/v1', v1);

// default routes
app.use('/', baseRoutes);

// error middleware
app.use(logErrors);
app.use(errorHandler);

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  // start the Express server
  const server = app.listen(SERVER_PORT, () => {
    logger.info(`listening on port ${SERVER_PORT}`);
  });

  // handle shutdown event
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received; closing server');
    server.close(() => {
      logger.info('all connections closed; server closed');
    });
  });
});
