import { Schema, model, Types } from 'mongoose';
import { IAccount } from './account';
import toJSON from './plugins/toJSON';

export interface ITodo {
  id?: Types.ObjectId | string;
  account: IAccount | Types.ObjectId | string;
  title: string;
  isComplete: boolean;
}

const todoSchema = new Schema<ITodo>({
  account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
  title: { type: String, required: true },
  isComplete: { type: Boolean, required: true, default: false },
});

todoSchema.plugin(toJSON);
const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
