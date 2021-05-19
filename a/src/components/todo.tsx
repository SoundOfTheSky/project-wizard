import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add } from '@/store/slices/todos';
import { RootState } from '@/store';
import './todo.scss';
import TodoItem from './todoItem';

function Todo() {
  const todosList = useSelector((state: RootState) => state.todos.list);
  const dispatch = useDispatch();
  const [addTodoName, setAddTodoName] = useState('');
  function addTask() {
    dispatch(add({ id: Date.now(), title: addTodoName, completed: false }));
    setAddTodoName('');
  }
  return (
    <div className="todo">
      <div className="title">Example todo app</div>
      <div className="add-todo">
        <input placeholder="Add new task" value={addTodoName} onChange={e => setAddTodoName(e.target.value)} />
        <div className="btn" onClick={addTask}>
          Add task
        </div>
      </div>
      <div className="todos">
        {todosList.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default Todo;
