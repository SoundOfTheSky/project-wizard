import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';
import '@/plugins/mirtAuth';
const app = createApp(App);
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event: MouseEvent) =>
      !(el === event.target || el.contains(event.target)) && binding.value(event, el);
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
});
app.use(store);
app.mount('#app');
