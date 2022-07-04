import app from './app';
import logger from './utils/logger';
import config from './config/config';
import { connectToDatabase } from './services/database-service';
import evolution from './changes';

// connect to the application database
connectToDatabase().then(async () => {
  // run Evolution changes
  await evolution.run();

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
