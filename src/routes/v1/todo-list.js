const Todos = require('../../database/todos');

const listTodos = async (req, res, next) => {
  try {
    console.log('handler::listTodos');
    const todos = await Todos.findAll();
    res.send(todos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTodos,
};
