import { createRouter, createWebHashHistory } from 'vue-router';
import Todo from '@/components/Todo.vue';
import About from '@/components/About.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Todo },
    { path: '/about', component: About },
  ],
});
export default router;
