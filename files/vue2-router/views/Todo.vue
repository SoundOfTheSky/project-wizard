<template>
  <div class="todo">
    <div class="title">Example todo app</div>
    <div class="add-todo">
      <input v-model="addTodoName" placeholder="Add new task" />
      <div class="btn" @click="addTask">Add task</div>
    </div>
    <div class="todos">
      <TodoItem v-for="todo of todoList" :key="todo.id" :todo="todo" @removeTask="removeTask" @toggleTask="toggleTask"/>
    </div>
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue';
import * as Api from '@/api';
export default {
  components: {
    TodoItem,
  },
  data() {
    return {
      addTodoName: '',
      todoList: [],
    };
  },
  async created() {
    this.todoList = await Api.getTodos();
    this
  },
  methods: {
    addTask() {
      this.todoList.push({ id: Date.now(), title: this.addTodoName, completed: false });
      this.addTodoName = '';
    },
    removeTask(id) {
      const i = this.todoList.findIndex(todo => todo.id === id);
      if (i > -1) this.todoList.splice(i, 1);
    },
    toggleTask(id) {
      const i = this.todoList.findIndex(todo => todo.id === id);
      if (i > -1) this.todoList[i].completed = !this.todoList[i].completed;
    },
  },
};
</script>
<style lang="scss" scoped>
.todo {
  width: 480px;
  margin: 0 auto;
  padding: 24px;
  overflow: hidden;
  background: #fff;
  border-radius: 16px;
  .title {
    margin-bottom: 24px;
    font-weight: bold;
    font-size: 24px;
  }
  .add-todo {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
    input {
      width: 80%;
      padding-left: 16px;
      font-size: 24px;
      border: 1px solid #ccc;
      border-radius: 3px;
      outline: none;
      transition: all 0.3s ease;
    }
  }
}
</style>
