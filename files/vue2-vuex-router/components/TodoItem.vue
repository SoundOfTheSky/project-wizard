<template>
  <div
    :key="todo.id"
    class="todo-item"
    :class="{ completed: todo.completed }"
    @click="$store.commit('toggleTodo', todo.id)"
  >
    <span :style="{ textDecorationLine: todo.completed ? 'line-through' : 'none' }">{{ todo.title }}</span>
    <div class="remove-button" @click="$store.commit('removeTodo', todo.id)">X</div>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.todo-item {
  position: relative;
  display: flex;
  width: 100%;
  height: 32px;
  margin-bottom: 8px;
  padding: 0 16px;
  overflow: hidden;
  line-height: 32px;
  background: #f2f2f2;
  cursor: pointer;
  transition: 0.2s;
  .remove-button {
    position: absolute;
    right: -32px;
    width: 32px;
    height: 32px;
    color: #fff;
    text-align: center;
    background: red;
    transition: 0.2s;
    &:hover {
      background: rgb(202, 3, 3);
    }
  }
  &:hover {
    background: #d4d4d4;
    .remove-button {
      right: 0;
    }
  }
  &.completed {
    background: #cbffd2;
    &:hover {
      background: #b9e9bf;
    }
  }
}
</style>
