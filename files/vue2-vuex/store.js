import Vue from 'vue';
import Vuex from 'vuex';
import * as Api from '@/api';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    todoList: [],
  },
  mutations: {
    set: (state, p) => Object.keys(p).forEach(key => (state[key] = p[key])),
    addTodo(state, payload) {
      state.todoList.push(payload);
    },
    removeTodo(state, id) {
      const i = state.todoList.findIndex(todo => todo.id === id);
      if (i > -1) state.todoList.splice(i, 1);
    },
    toggleTodo(state, id) {
      const i = state.todoList.findIndex(todo => todo.id === id);
      if (i > -1) state.todoList[i].completed = !state.todoList[i].completed;
    },
  },
  actions: {
    async loadTodos({ commit }) {
      commit('set', { todoList: await Api.getTodos() });
    },
  },
});

export default store;
