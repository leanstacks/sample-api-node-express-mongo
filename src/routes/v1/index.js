// routes/v1/index.js

const express = require('express');

// todo route handlers
const { findTodo } = require('./todo-find');
const { listTodos } = require('./todo-list');
const { createTodo } = require('./todo-create');
const { updateTodo } = require('./todo-update');
const { deleteTodo } = require('./todo-delete');

const router = express.Router();

router.get('/todos/:id', findTodo);
router.get('/todos', listTodos);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

module.exports = router;
