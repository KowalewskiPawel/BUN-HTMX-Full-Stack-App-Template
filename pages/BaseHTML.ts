import * as elements from "typed-html";

export const BaseHTML = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BUN HTMX TEMPLATE</title>
    <script src="https://unpkg.com/htmx.org@1.9.5"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

${children}
`;
