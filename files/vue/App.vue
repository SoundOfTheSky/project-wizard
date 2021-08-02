<template>
  <div class="app">
    <Todo />
  </div>
</template>
<script lang="ts" setup>
import Todo from '@/components/Todo.vue';
</script>
<style>
*,
*::after,
*::before {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.app {
  display: grid;
  align-items: center;
  min-height: 100vh;
  background: #dfdfdf;
}
.btn {
  display: grid;
  align-items: center;
  padding: 4px;
  color: #fff;
  background: #00aeff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.bth:hover {
  background: #0299df;
}
</style>
