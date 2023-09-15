import { Database } from "bun:sqlite";

const db = new Database("todosdb.sqlite", { create: true });

db.run(
  "CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, completed INTEGER);"
);

const insertQuery = db.prepare(
  "INSERT INTO todos (content, completed) VALUES ($content, $completed)"
);
const insertTodos = db.transaction((todos) => {
  for (const todo of todos) insertQuery.run(todo);
});

const plan = db.transaction((todos) => {
  insertTodos(todos);
});

plan([
  { $content: "Finish this app", $completed: 1 },
  { $content: "Add SQL", $completed: 0 },
]);
