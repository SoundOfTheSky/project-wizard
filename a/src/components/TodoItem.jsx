import React from 'react';
import PropTypes from 'prop-types';
function Todo({ todo, toggle, remove }) {
  function onRemoveClick(e) {
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
Todo.propTypes = {
  todo: PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};
export default Todo;
