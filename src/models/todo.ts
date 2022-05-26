import { Schema, model } from 'mongoose';
import toJSON from './plugins/toJSON';

export interface ITodo {
  title: string;
  isComplete: boolean;
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  isComplete: { type: Boolean, required: true, default: false },
});

todoSchema.plugin(toJSON);
const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
