import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

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
        ></body>
      </BaseHTML>
    )
  )
  .post("/clicked", () => <div class="text-blue-600">Response from BUN!</div>)
  .get("/todos", () => <TodoList todos={db} />)
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
      const newTodo = {
        id: crypto.randomUUID(),
        content: body.content,
        completed: false,
      };
      db.push(newTodo);
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

const BaseHTML = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BUN HTMX TEMPLATE</title>
    <script src="https://unpkg.com/htmx.org@1.9.5"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

${children}
`;

type Todo = {
  id: string;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  { id: "1", content: "Finish this app", completed: true },
  { id: "2", content: "Add SQL", completed: false },
];

const TodoItem = ({ content, completed, id }: Todo) => (
  <div class="flex flex-row space-x-3">
    <p>{content}</p>
    <input
      type="checkbox"
      checked={completed}
      hx-post={`todos/toggle/${id}`}
      hx-target="closest div"
      hx-swap="outerHTML"
    />
    <button
      class="text-red-500"
      hx-delete={`/todos/${id}`}
      hx-swap="outerHTML"
      hx-target="closest div"
    >
      X
    </button>
  </div>
);

const TodoList = ({ todos }: { todos: Todo[] }) => (
  <div>
    {todos.map((todo) => (
      <TodoItem {...todo} />
    ))}
    <TodoForm />
  </div>
);

const TodoForm = () => (
  <form class="flex flex-row space-x-3" hx-post="/todos" hx-swap="beforebegin">
    <input type="text" name="content" class="border border-black" />
    <button type="submit">Add</button>
  </form>
);
