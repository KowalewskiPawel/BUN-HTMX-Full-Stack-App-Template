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
  .post(
    "/todos/toggle/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
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
  id: number;
  content: string;
  completed: boolean;
};

const db: Todo[] = [
  { id: 1, content: "Finish this app", completed: true },
  { id: 2, content: "Add SQL", completed: false },
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
    <button class="text-red-500">X</button>
  </div>
);

const TodoList = ({ todos }: { todos: Todo[] }) => (
  <div>
    {todos.map((todo) => (
      <TodoItem {...todo} />
    ))}
  </div>
);
