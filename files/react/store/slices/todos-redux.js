import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTodos } from '@/api';
const initialState = {
  list: [
    { completed: false, id: 0, title: 'test 1' },
    { completed: true, id: 1, title: 'test 2' },
  ],
  status: 'idle',
};
export const getTodosAction = createAsyncThunk('todos/getTodos', getTodos);
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add(state, { payload }) {
      state.list.push(payload);
    },
    remove(state, { payload }) {
      const i = payload.i ?? state.list.findIndex(todo => todo.id === payload.id);
      if (i !== -1) state.list.splice(i, 1);
    },
    toggle(state, { payload }) {
      const i = payload.i ?? state.list.findIndex(todo => todo.id === payload.id);
      if (i !== -1) state.list[i].completed = !state.list[i].completed;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getTodosAction.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTodosAction.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      });
  },
});
export const { add, remove, toggle } = todosSlice.actions;
export default todosSlice.reducer;
