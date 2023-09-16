// This file should be run only to create new DB Instance and populate it with some data
import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";

// Create new Database instance, if there isn't a file "todosdb.sqlite" yet

const db = new Database("./src/database/todosdb.sqlite", { create: true });

// Create Table on the Database instance, with the columns defined in the brackets

/* 
  The "id" could have been defined as INTEGER AUTOINCREMENT
  However, in this example "id" is generated with "crypto.randomUUID()" method
  so that on the successful row addition, the ID is known and the last entry can
  be queried. Otherwise, there would be need to check all of the entries and look for the given
  entry's id so return it.
*/
db.run(
  "CREATE TABLE todos (id TEXT PRIMARY KEY UNIQUE, content TEXT, completed INTEGER);"
);

// Query below prepares a query without caching it on the Database instance.

const insertQuery = db.prepare(
  "INSERT INTO todos (id, content, completed) VALUES ($id, $content, $completed)"
); 

// SQL Transaction for adding the TODO Tasks to new DB instance

const insertTodos = db.transaction((todos) => {
  for (const todo of todos) insertQuery.run(todo);
});

// The plan function that takes the array of the values, and then inserts them to the DB

const plan = db.transaction((todos) => {
  insertTodos(todos); // Nested Transaction
});

// Database is populated at this point

plan([
  { $id: randomUUID(), $content: "Finish this app", $completed: 1 },
  { $id: randomUUID(), $content: "Add SQL", $completed: 0 },
]);
