const HealthStatus = {
  UP: 'UP',
  DOWN: 'DOWN',
};

const health = (req, res, next) => {
  try {
    console.log('handler::health');
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
