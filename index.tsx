// The entry file to the app
// Elysia is Express like Server Apps Framework for Bun
import { Elysia, t } from "elysia";
// This plugin is needed for sending HTML files as a response with correct headers
import { html } from "@elysiajs/html";
// Definition of the HTML/JSX Element types
import * as elements from "typed-html";
import { BaseHTML } from "./src/pages";
import { TodoItem, TodoList } from "./src/components";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  getTodo,
  updateTodo,
} from "./src/database/dbMethods";

// New App instance

const app = new Elysia()
  .use(html()) // Middleware for parsing the HTML components correctly
  .get("/", ({ html }) => // Default route that returns the main structure of the page
    html(
      <BaseHTML>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        />
      </BaseHTML>
    ) // On body load, "/todos" endpoint is called, which fetches the list of the Todo items and renders the list
  )
  .get("/todos", () => {
    // All todos are fetched here from the SQLite database
    const allTodos = getAllTodos();

    // As a return the TodoList with respective elements is rendered to the UI
    return <TodoList todos={allTodos} />;
  })
  .post("/todos/toggle/:id", ({ params }) => {
    // This is the endpoint that is being called each time when the user changes the status of the given Todo item

    // First of all we check if the given Todo Exists
    const todo = getTodo(params.id);
    if (todo) {
      // This method updates the todo status and returns the new version of it
      const updatedTodo = updateTodo(todo.id, !todo.completed);
      // Updated TodoItem is returned and rendered to the UI
      return <TodoItem {...updatedTodo} />;
    }
  })
  .delete("/todos/:id", ({ params }) => {
    // The endpoint for deleting the given Todo item
    const todo = getTodo(params.id);
    if (todo) {
      deleteTodo(todo.id);
    }
  })
  .post(
    "/todos",
    ({ body }) => {
      // The endpoint for adding new Todo item to the list

      // Firstly we check if there is anything in the request body's content key
      if (!body.content.length) {
        throw new Error("Content cannot be empty");
      }

      // A new Todo Item is added to the database at this point and returned as a object
      const newTodo = addTodo(body.content);

      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.String(), // The optional body type builder from Elysia framework
      }),
    }
  )
  .listen(3000);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
