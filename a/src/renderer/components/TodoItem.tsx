import React from 'react';
import { useDispatch } from 'react-redux';
import { remove, toggle, todoItem } from '@/renderer/store/slices/todos';

function Todo({ todo }: { todo: todoItem }) {
  const dispatch = useDispatch();
  return (
    <div
      key={todo.id}
      className={'todo-item' + (todo.completed ? ' completed' : '')}
      onClick={() => dispatch(toggle({ id: todo.id }))}
    >
      <span style={{ textDecorationLine: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
      <div className="remove-button" onClick={() => dispatch(remove({ id: todo.id }))}>
        X
      </div>
    </div>
  );
}

export default Todo;
