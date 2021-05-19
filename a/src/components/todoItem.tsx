import React from 'react';
import { useDispatch } from 'react-redux';
import { remove, toggle, todoItem } from '@/store/slices/todos';

function Todo({ todo }: { todo: todoItem }) {
  const dispatch = useDispatch();
  return (
    <div key={todo.id} className="todo-item">
      <span>{todo.title}</span>
      <button onClick={() => dispatch(remove({ id: todo.id }))}>X</button>
      <input type="checkbox" checked={todo.completed} onChange={() => dispatch(toggle({ id: todo.id }))} />
    </div>
  );
}

export default Todo;
