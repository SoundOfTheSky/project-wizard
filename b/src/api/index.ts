export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}
export const getTodos = async (): Promise<TodoItem[]> =>
  (await (await fetch('https://jsonplaceholder.typicode.com/todos')).json()).slice(0, 4);
