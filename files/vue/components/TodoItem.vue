<template>
  <div :key="todo.id" class="todo-item" :class="{ completed: todo.completed }" @click="toggleTodo(todo)">
    <span :style="{ textDecorationLine: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
    <div className="remove-button" @click="removeTodo(todo)">X</div>
  </div>
</template>
<script lang="ts" setup>
import type { TodoItem } from '@/api';
import type { PropType } from 'vue';
defineProps({
  todo: {
    type: Object as PropType<TodoItem>,
    required: true,
  },
  toggleTodo: {
    type: Function as PropType<(todo: TodoItem) => void>,
    required: true,
  },
  removeTodo: {
    type: Function as PropType<(todo: TodoItem) => void>,
    required: true,
  },
});
</script>
