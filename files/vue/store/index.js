import { createStore } from 'vuex';
import Todos from './todos';
const store = createStore({
  modules: {
    Todos,
  },
});
export default store;