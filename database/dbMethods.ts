import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import { Todo } from "../types/Todo";

const db = new Database("./database/todosdb.sqlite");

const readQuery = db.query("SELECT * FROM todos");

export const getTodo = (id: string) => {
  const readQuery = db.query("SELECT * FROM todos WHERE id = $id");

  const queryResult = readQuery.values({ $id: id })[0];

  return {
    id: queryResult[0],
    content: queryResult[1],
    completed: !!queryResult[2],
  } as Todo;
};

export const getAllTodos = (): Todo[] =>
  readQuery.values().map((todo) => ({
    id: todo[0],
    content: todo[1],
    completed: !!todo[2],
  })) as Todo[];

export const addTodo = (content: string) => {
  const insertQuery = db.query(
    "INSERT INTO todos (id, content, completed) VALUES ($id, $content, $completed)"
  );

  const newTodoId = randomUUID();

  insertQuery.all({
    $id: newTodoId,
    $content: content,
    $completed: 0,
  });

  const queryResult = getTodo(newTodoId);

  return queryResult;
};

export const updateTodo = (id: string, completed: boolean) => {
  const updateQuery = db.query(
    "UPDATE todos SET completed = $completed WHERE id = $id"
  );

  updateQuery.all({
    $id: id,
    $completed: completed ? 1 : 0,
  });

  const queryResult = getTodo(id);

  return queryResult;
};

export const deleteTodo = (id: string) => {
    const deleteQuery = db.query(
      "DELETE FROM todos WHERE id = $id"
    );
  
    deleteQuery.all({
      $id: id
    });
  };
