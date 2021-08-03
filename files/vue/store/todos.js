import { getTodos } from '@/api';
const state = {
  list: [
    { completed: false, id: 0, title: 'test 1' },
    { completed: true, id: 1, title: 'test 2' },
  ],
  status: 'idle',
};
const store = {
  namespaced: true,
  state,
  mutations: {
    add: (state, payload) => state.list.push(payload),
    set: (state, payload) => (state.list = payload),
    remove(state, payload) {
      const i = state.list.findIndex(todo => todo.id === payload.id);
      if (i !== -1) state.list.splice(i, 1);
    },
    toggle(state, payload) {
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
