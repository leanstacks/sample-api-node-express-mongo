const Todos = require('../../database/todos');

const deleteTodo = async (req, res, next) => {
  try {
    console.log('handler::deleteTodo');
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
