import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BaseHTML } from "./pages";
import { TodoItem, TodoList } from "./components";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
} from "./database/dbMethods";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHTML>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        />
      </BaseHTML>
    )
  )
  .get("/todos", () => {
    const allTodos = getAllTodos();

    return <TodoList todos={allTodos} />;
  })
  .post("/todos/toggle/:id", ({ params }) => {
    const todo = getTodo(params.id);
    if (todo) {
      const updatedTodo = updateTodo(todo.id, !todo.completed);
      return <TodoItem {...updatedTodo} />;
    }
  })
  .delete("/todos/:id", ({ params }) => {
    const todo = getTodo(params.id);
    if (todo) {
      deleteTodo(todo.id);
    }
  })
  .post(
    "/todos",
    ({ body }) => {
      if (body.content.length === 0) {
        throw new Error("Content cannot be empty");
      }
      const newTodo = addTodo(body.content);

      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .listen(3000);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
