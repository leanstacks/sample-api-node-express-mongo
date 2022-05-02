const logger = require('../../utils/logger');
const Todos = require('../../database/todos');

const listTodos = async (req, res, next) => {
  try {
    logger.info('handler::listTodos');
    const todos = await Todos.findAll();
    res.send(todos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTodos,
};
