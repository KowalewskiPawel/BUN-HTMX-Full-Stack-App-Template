// All of the methods that can be executed on the Database are located in this file
import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import { Todo } from "../types/Todo";

// First of all we read the local DB file

const db = new Database("./src/database/todosdb.sqlite");

// General Query for getting all of the elements from "todos" table

const readQuery = db.query("SELECT * FROM todos");

// Get a single Todo method

export const getTodo = (id: string) => {
  // The query here takes the argument of id, so that we can find the given todo item
  const readQuery = db.query("SELECT * FROM todos WHERE id = $id");

  // This method returns the values that are read from the given query, as a double nested arrays

  const queryResult = readQuery.values({ $id: id })[0];

  // Stop executing the method if no record is found

  if (!queryResult) throw new Error("The record wasn't found");

  // Since the values are returned as a plain array of values, the Todo object is created below

  return {
    id: queryResult[0],
    content: queryResult[1],
    // SQLite doesn't support Boolean type, that is why the 0/1 values has to be casted to a boolean value
    completed: !!queryResult[2],
  } as Todo;
};

// Get All Todos from the DB and convert the values to the Todo Object type

export const getAllTodos = (): Todo[] =>
  readQuery.values().map((todo) => ({
    id: todo[0],
    content: todo[1],
    completed: !!todo[2],
  })) as Todo[];

// Add New Todo method

export const addTodo = (content: string) => {
  const insertQuery = db.query(
    "INSERT INTO todos (id, content, completed) VALUES ($id, $content, $completed)"
  );

  const newTodoId = randomUUID();

  // Query is executed at this place with the given argument

  insertQuery.all({
    $id: newTodoId,
    $content: content,
    $completed: 0,
  });

  // After adding a new todo to the table, getTodo method is called to return the todoItem
  const queryResult = getTodo(newTodoId);

  return queryResult;
};

// Update Todo method for changing the "completed" status
export const updateTodo = (id: string, completed: boolean) => {
  const updateQuery = db.query(
    "UPDATE todos SET completed = $completed WHERE id = $id"
  );

  updateQuery.all({
    $id: id,
    // SQLite doesn't support Boolean types therefore the conversion above
    $completed: completed ? 1 : 0,
  });

  const queryResult = getTodo(id);

  // After updating the status we return the updated item to reflect it in the UI

  return queryResult;
};

// Delete Todo item method

export const deleteTodo = (id: string) => {
  const deleteQuery = db.query("DELETE FROM todos WHERE id = $id");

  deleteQuery.all({
    $id: id,
  });
};
