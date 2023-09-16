import * as elements from "typed-html";
import { Todo } from "../types";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";

export const TodoList = ({ todos }: { todos: Todo[] }) => (
  <div>
    {todos.map((todo) => (
      <TodoItem {...todo} />
    ))}
    <TodoForm />
  </div>
);
