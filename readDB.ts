import { Database } from "bun:sqlite";

const db = new Database("todosdb.sqlite", { readonly: true });

const readQuery = db.query("SELECT * FROM todos");

console.log(readQuery.values());