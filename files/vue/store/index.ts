import { createStore, useStore as baseUseStore } from 'vuex';
import Todos from './todos';
import type { State as TodosState } from './todos';
export interface State {
  Todos: TodosState;
}
const store = createStore<State>({
  modules: {
    Todos,
  },
});
export default store;
export function useStore(): typeof store {
  return baseUseStore();
}
