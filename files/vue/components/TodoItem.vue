<template>
  <div :key="todo.id" class="todo-item" :class="{ completed: todo.completed }" @click="toggleTodo(todo)">
    <span :style="{ textDecorationLine: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
    <div className="remove-button" @click="removeTodo(todo)">X</div>
  </div>
</template>
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
  toggleTodo: {
    type: Function,
    required: true,
  },
  removeTodo: {
    type: Function,
    required: true,
  },
});
</script>
