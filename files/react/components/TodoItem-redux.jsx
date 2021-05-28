import React from 'react';
import { useDispatch } from 'react-redux';
import { remove, toggle } from '@/store/slices/todos';
import PropTypes from 'prop-types';

function Todo({ todo }) {
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
Todo.propTypes = {
  todo: PropTypes.shape({
    completed: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};
export default Todo;
