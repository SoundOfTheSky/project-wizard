import { getTodos } from '@/api';
import type { TodoItem } from '@/api';
import type { Module } from 'vuex';
import type { State as RootState } from '.';
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
const store: Module<State, RootState> = {
  namespaced: true,
  state,
  mutations: {
    add: (state, payload: TodoItem) => state.list.push(payload),
    set: (state, payload: TodoItem[]) => (state.list = payload),
    remove(state, payload: TodoItem) {
      const i = state.list.findIndex(todo => todo.id === payload.id);
      if (i !== -1) state.list.splice(i, 1);
    },
    toggle(state, payload: TodoItem) {
      const i = state.list.findIndex(todo => todo.id === payload.id);
      if (i !== -1) state.list[i].completed = !state.list[i].completed;
    },
  },
  actions: {
    async load({ commit }) {
      const todos = await getTodos();
      commit('set', todos);
      return todos;
    },
  },
};
export default store;
