// This is a mocked version of the DB that works just as an "in-memory" Object instance
import { Todo } from "../types";

export const db: Todo[] = [
    { id: "1", content: "Finish this app", completed: true },
    { id: "2", content: "Add SQL", completed: false },
  ];