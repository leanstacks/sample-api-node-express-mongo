const logger = require('../../utils/logger');
const Todos = require('../../database/todos');

const createTodo = async (req, res, next) => {
  try {
    logger.info('handler::createTodo');
    const todo = req.body;
    const createdTodo = await Todos.create(todo);
    res.send(createdTodo);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTodo,
};
