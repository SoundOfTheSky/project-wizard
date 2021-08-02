import { createApp } from 'vue';
import App from '@/App.vue';
import Store from '@/store';
import Router from '@/router';
const app = createApp(App);
app.use(Store);
app.use(Router);
app.mount('#root');
