import { todoItem } from '@/store/slices/todos';

export const getTodos = async (): Promise<todoItem[]> =>
  (await (await fetch('https://jsonplaceholder.typicode.com/todos')).json()).slice(0, 4);
