import { Schema, model } from 'mongoose';

export interface ITodo {
  title: string;
  isComplete: boolean;
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  isComplete: { type: Boolean, required: true },
});

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
