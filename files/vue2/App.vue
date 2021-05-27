<template>
  <div class="app">
    <Todo />
  </div>
</template>
<script>
import Todo from '@/views/Todo.vue';
export default {
  components: {
    Todo,
  },
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.app {
  display: grid;
  align-items: center;
  min-height: 100vh;
  background: rgb(223, 223, 223);
}
.btn {
  display: grid;
  align-items: center;
  padding: 4px;
  color: #fff;
  background: rgb(0, 174, 255);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgb(2, 153, 223);
  }
}
</style>
