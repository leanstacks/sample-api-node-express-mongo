// routes/v1/todos/index.ts

import express from 'express';

// todo route handlers
import { findTodo } from './todo-find';
import { listTodos } from './todo-list';
import { createTodo } from './todo-create';
import { updateTodo } from './todo-update';
import { deleteTodo } from './todo-delete';

const router = express.Router();

router.post('/', createTodo);
router.get('/', listTodos);
router.get('/:id', findTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
