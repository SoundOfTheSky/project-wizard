<template>
  <div class="todo">
    <div class="title">Example todo app</div>
    <div class="add-todo">
      <input v-model="addTodoName" placeholder="Add new task" />
      <div class="btn" @click="addTask">Add task</div>
    </div>
    <div class="todos">
      <TodoItem v-for="todo of todoList" :key="todo.id" :todo="todo" />
    </div>
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue';
export default {
  components: {
    TodoItem,
  },
  data() {
    return {
      addTodoName: '',
    };
  },
  computed: {
    todoList() {
      return this.$store.state.todoList;
    },
  },
  methods: {
    addTask() {
      this.$store.commit('addTodo', { id: Date.now(), title: this.addTodoName, completed: false });
      this.addTodoName = '';
    },
  },
  created() {
    this.$store.dispatch('loadTodos');
  }
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
