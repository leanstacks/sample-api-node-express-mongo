const logger = require('../utils/logger');

const HealthStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
};

const health = (req, res, next) => {
  try {
    logger.info('handler::health');
    res.send({
      status: HealthStatus.UP,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  health,
};
