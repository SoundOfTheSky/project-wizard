<template>
  <div class="todo">
    <div class="title">Example todo app</div>
    <div class="add-todo">
      <input v-model="addTodoName" placeholder="Add new task" />
      <div class="btn" @click="addTask">Add task</div>
    </div>
    <div className="todos">
      <TodoItem v-for="todo of todoList" :key="todo.id" :todo="todo" />
    </div>
    <router-link to="/about">About</router-link>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import TodoItem from '@/components/TodoItem.vue';
const store = useStore();
const addTodoName = ref('');
const todoList = computed(() => store.state.Todos.list);
function addTask() {
  store.commit('Todos/add', { id: Date.now(), title: addTodoName.value, completed: false });
  addTodoName.value = '';
}
onMounted(() => store.dispatch('Todos/load'));
</script>
<style>
.todo {
  width: 480px;
  margin: 0 auto;
  padding: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 16px;
}
.todo .title {
  margin-bottom: 24px;
  font-weight: bold;
  font-size: 24px;
}
.todo .add-todo {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
}
.todo .add-todo input {
  width: 80%;
  padding-left: 16px;
  font-size: 24px;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: none;
  transition: all 0.3s ease;
}
.todo .todo-item {
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
}
.todo .todo-item .remove-button {
  position: absolute;
  right: -32px;
  width: 32px;
  height: 32px;
  color: #fff;
  text-align: center;
  background: red;
  transition: 0.2s;
}
.todo .todo-item .remove-button:hover {
  background: #ca0303;
}
.todo .todo-item:hover {
  background: #d4d4d4;
}
.todo .todo-item:hover .remove-button {
  right: 0;
}
.todo .todo-item.completed {
  background: #cbffd2;
}
.todo .todo-item.completed:hover {
  background: #b9e9bf;
}
</style>
