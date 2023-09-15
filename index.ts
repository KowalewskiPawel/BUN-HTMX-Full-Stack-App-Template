import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello from BUN!").listen(3000);

console.log(`Server running at http://${app.server?.hostname}:${app.server?.port}`);