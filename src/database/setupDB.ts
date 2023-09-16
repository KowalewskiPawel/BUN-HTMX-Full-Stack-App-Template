import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";

const db = new Database("./src/database/todosdb.sqlite", { create: true });

db.run(
  "CREATE TABLE todos (id TEXT PRIMARY KEY UNIQUE, content TEXT, completed INTEGER);"
);

const insertQuery = db.prepare(
  "INSERT INTO todos (id, content, completed) VALUES ($id, $content, $completed)"
); 
const insertTodos = db.transaction((todos) => {
  for (const todo of todos) insertQuery.run(todo);
});

const plan = db.transaction((todos) => {
  insertTodos(todos);
});

plan([
  { $id: randomUUID(), $content: "Finish this app", $completed: 1 },
  { $id: randomUUID(), $content: "Add SQL", $completed: 0 },
]);
