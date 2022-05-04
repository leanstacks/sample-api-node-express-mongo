const logger = require('../utils/logger');

const logErrors = (err, req, res, next) => {
  logger.error(err.stack);
  next(err);
};

const errorHandler = (err, req, res) => {
  res.status(500);
  res.end();
};

module.exports = {
  errorHandler,
  logErrors,
};
