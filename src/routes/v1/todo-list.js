const Todos = require('../../database/todos');

const listTodos = async (req, res) => {
  console.log('handler::listTodos');
  const todos = await Todos.findAll();
  res.send(todos);
};

module.exports = {
  listTodos,
};
