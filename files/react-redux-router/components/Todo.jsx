import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add, getTodosAction } from '@/store/slices/todos';
import './Todo.scss';
import TodoItem from './TodoItem';
import { Link } from 'react-router-dom';

function Todo() {
  const todosList = useSelector(state => state.todos.list);
  const dispatch = useDispatch();
  const [addTodoName, setAddTodoName] = useState('');
  function addTask() {
    dispatch(add({ id: Date.now(), title: addTodoName, completed: false }));
    setAddTodoName('');
  }
  useEffect(() => {
    dispatch(getTodosAction());
  }, []);
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
      <Link to="/about">About</Link>
    </div>
  );
}

export default Todo;
