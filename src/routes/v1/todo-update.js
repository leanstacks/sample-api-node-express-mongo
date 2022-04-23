const Todos = require('../../database/todos');

const updateTodo = async (req, res) => {
  console.log('handler::updateTodo');
  const todo = req.body;
  const updatedTodo = await Todos.update(req.params.id, todo);
  res.send(updatedTodo);
};

module.exports = {
  updateTodo,
};
