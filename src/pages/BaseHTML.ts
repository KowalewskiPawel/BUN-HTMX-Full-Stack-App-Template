import * as elements from "typed-html";

/* 
    This is the Outer HTML Element that wraps the whole app
    Inside 3 JS scripts are fetched:
    - HTMX script for parsing HTMX specific tags
    - Tailwind CSS for custom Tailwind CSS classes OPTIONAL
    - Hyperscript for parsing the inline client-side JS scripts
*/

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
    <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
</head>

${children}
`;
