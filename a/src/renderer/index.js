import '@/renderer/index.css';
import * as Api from '@/renderer/api';
const root = document.getElementById('root');
const app = document.createElement('div');
app.className = 'app';
root?.appendChild(app);
const todo = document.createElement('div');
todo.className = 'todo';
app.appendChild(todo);
const title = document.createElement('div');
title.className = 'title';
const addTodo = document.createElement('div');
addTodo.className = 'add-todo';
const input = document.createElement('input');
input.placeholder = 'Add new task';
const btn = document.createElement('div');
btn.className = 'btn';
btn.textContent = 'Add todo';
const todos = document.createElement('div');
todos.className = 'todos';
todo.appendChild(title);
addTodo.appendChild(input);
addTodo.appendChild(btn);
btn.addEventListener('click', () => {
  addTodoItem({
    completed: false,
    id: Date.now(),
    title: input.value,
  });
  input.value = '';
});
todo.appendChild(addTodo);
todo.appendChild(todos);
function addTodoItem(todoItem) {
  const item = document.createElement('div');
  item.className = 'todo-item';
  if (todoItem.completed) item.classList.add('completed');
  const span = document.createElement('span');
  span.textContent = todoItem.title;
  span.style.textDecoration = 'none';
  const x = document.createElement('div');
  x.className = 'remove-button';
  x.textContent = 'X';
  x.addEventListener('click', removeTodoItem);
  item.appendChild(span);
  item.appendChild(x);
  item.addEventListener('click', toggleTodoItem);
  item.setAttribute('todoId', '' + todoItem.id);
  todos.appendChild(item);
}
function toggleTodoItem(e) {
  const el = e.currentTarget;
  if (el.classList.contains('completed')) el.classList.remove('completed');
  else el.classList.add('completed');
}
function removeTodoItem(e) {
  e.stopPropagation();
  e.currentTarget.parentElement?.remove();
}
(async () => {
  for (const todo of await Api.getTodos()) addTodoItem(todo);
})();
export {};
