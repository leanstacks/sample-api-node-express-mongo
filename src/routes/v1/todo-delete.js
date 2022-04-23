const Todos = require('../../database/todos');

const deleteTodo = async (req, res) => {
  console.log('handler::deleteTodo');
  await Todos.delete(req.params.id);
  res.status(204);
  res.end();
};

module.exports = {
  deleteTodo,
};
