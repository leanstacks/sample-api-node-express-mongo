// routes/v1/index.ts

import express from 'express';

// todo route handlers
import { findTodo } from '../../routes/v1/todo-find';
import { listTodos } from '../../routes/v1/todo-list';
import { createTodo } from '../../routes/v1/todo-create';
import { updateTodo } from '../../routes/v1/todo-update';
import { deleteTodo } from '../../routes/v1/todo-delete';

const router = express.Router();

router.get('/todos/:id', findTodo);
router.get('/todos', listTodos);
router.post('/todos', createTodo);
router.put('/todos/:id', updateTodo);
router.delete('/todos/:id', deleteTodo);

export default router;
