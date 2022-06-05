import app from './app';
import logger from './utils/logger';
import config from './config/config';
import { connectToDatabase } from './services/database-service';

// start the in-memory MongoDB instance
connectToDatabase().then(async () => {
  // start the Express server
  const server = app.listen(config.SERVER_PORT, () => {
    logger.info(`listening on port ${config.SERVER_PORT}`);
  });

  // handle shutdown event
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received; closing server');
    server.close(() => {
      logger.info('all connections closed; server closed');
    });
  });
});
