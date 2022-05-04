const logger = require('../../utils/logger');
const Todos = require('../../database/todos');

const deleteTodo = async (req, res, next) => {
  try {
    logger.info('handler::deleteTodo');
    await Todos.delete(req.params.id);
    res.status(204);
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  deleteTodo,
};
