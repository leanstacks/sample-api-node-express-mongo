const Todos = require('../../database/todos');

const findTodo = async (req, res, next) => {
  try {
    console.log('handler::findTodo');
    const todo = await Todos.findById(req.params.id);
    if (todo) {
      res.send(todo);
    } else {
      res.status(404);
      res.end();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findTodo,
};
