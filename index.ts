import { Elysia } from "elysia";
import { html } from "@elysiajs/html";

const app = new Elysia().use(html()).get("/", ({ html }) => html(testHTML)).listen(3000);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}`
);

const testHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    Hello From BUN!
</body>
</html>`;