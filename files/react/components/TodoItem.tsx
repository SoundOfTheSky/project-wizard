import { todoItem } from '@/api';
import React from 'react';
interface TodoItemComponent {
  todo: todoItem;
  toggle: (todoItem: todoItem) => void;
  remove: (todoItem: todoItem) => void;
}
function Todo({ todo, toggle, remove }: TodoItemComponent) {
  function onRemoveClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    remove(todo);
  }
  return (
    <div key={todo.id} className={'todo-item' + (todo.completed ? ' completed' : '')} onClick={() => toggle(todo)}>
      <span style={{ textDecorationLine: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
      <div className="remove-button" onClick={onRemoveClick}>
        X
      </div>
    </div>
  );
}

export default Todo;
