const logger = require('../../utils/logger');
const Todos = require('../../database/todos');

const updateTodo = async (req, res, next) => {
  try {
    logger.info('handler::updateTodo');
    const todo = req.body;
    const updatedTodo = await Todos.update(req.params.id, todo);
    res.send(updatedTodo);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateTodo,
};
