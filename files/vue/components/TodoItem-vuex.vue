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
<script setup>
import { useStore } from 'vuex';
defineProps({
  todo: {
    type: Object,
    required: true,
  },
});
const store = useStore();
</script>
