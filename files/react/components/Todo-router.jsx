import React, { useEffect, useState } from 'react';
import './Todo.scss';
import TodoItem from './TodoItem';
import { getTodos } from '@/api';
import { Link } from 'react-router-dom';
function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [addTodoName, setAddTodoName] = useState('');
  function addTask() {
    setTodoList(state => [...state, { id: Date.now(), title: addTodoName, completed: false }]);
    setAddTodoName('');
  }
  useEffect(() => {
    getTodos().then(el => setTodoList(el));
  }, []);
  function toggleTask(task) {
    const todos = [...todoList];
    const todo = todos.find(el => el.id === task.id);
    todo.completed = !task.completed;
    setTodoList(todos);
  }
  function removeTask(task) {
    setTodoList(state => state.filter(el => el.id !== task.id));
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
        {todoList.map(todo => (
          <TodoItem key={todo.id} todo={todo} toggle={toggleTask} remove={removeTask} />
        ))}
      </div>
      <Link to="/about">About</Link>
    </div>
  );
}

export default Todo;
