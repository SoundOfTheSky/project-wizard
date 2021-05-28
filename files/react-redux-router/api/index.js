export const getTodos = async () =>
  (await (await fetch('https://jsonplaceholder.typicode.com/todos')).json()).slice(0, 4);
