const Todos = require('../../database/todos');

const createTodo = async (req, res, next) => {
  try {
    console.log('handler::createTodo');
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
