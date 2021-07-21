export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}
export interface State {
  list: TodoItem[];
  status: string;
}
const state: State = {
  list: [
    { completed: false, id: 0, title: 'test 1' },
    { completed: true, id: 1, title: 'test 2' },
  ],
  status: 'idle',
};
export default {
  namespaced: true,
  state,
};
