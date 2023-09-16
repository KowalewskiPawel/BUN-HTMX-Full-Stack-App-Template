import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { BaseHTML } from "./pages";
import { db } from "./MOCKS/db";
import { TodoItem, TodoList } from "./components";
import { addTodo, getAllTodos } from "./database/dbMethods";

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
    const todo = db.find((todo) => todo.id === params.id);
    if (todo) {
      todo.completed = !todo.completed;
      return <TodoItem {...todo} />;
    }
  })
  .delete("/todos/:id", ({ params }) => {
    const todo = db.find((todo) => todo.id === params.id);
    if (todo) {
      db.splice(db.indexOf(todo), 1);
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
