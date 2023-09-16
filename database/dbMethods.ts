import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import { Todo } from "../types/Todo";

const db = new Database("./database/todosdb.sqlite");

const readQuery = db.query("SELECT * FROM todos");

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

  const readQuery = db.query("SELECT * FROM todos WHERE id=$id");

  const queryResult = readQuery.values({ $id: newTodoId })[0];

  return {
    id: queryResult[0],
    content: queryResult[1],
    completed: !!queryResult[2],
  } as Todo;
};
