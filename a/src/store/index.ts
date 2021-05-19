import { configureStore } from '@reduxjs/toolkit';
import todos from './slices/todos';

export const store = configureStore({
  reducer: {
    todos,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
