<template>
  <div
    :key="todo.id"
    class="todo-item"
    :class="{ completed: todo.completed }"
    @click="store.commit('Todos/toggle', todo)"
  >
    <span :style="{ textDecorationLine: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
    <div className="remove-button" @click="store.commit('Todos/remove', todo)">X</div>
  </div>
</template>
<script lang="ts" setup>
import type { TodoItem } from '@/api';
import { useStore } from '@/store';
import type { PropType } from 'vue';
defineProps({
  todo: {
    type: Object as PropType<TodoItem>,
    required: true,
  },
});
const store = useStore();
</script>
