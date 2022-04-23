const Todos = require('../../database/todos');

const createTodo = async (req, res) => {
  console.log('handler::createTodo');
  const todo = req.body;
  const createdTodo = await Todos.create(todo);
  res.send(createdTodo);
};

module.exports = {
  createTodo,
};
