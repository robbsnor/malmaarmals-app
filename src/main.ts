import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';

import Card from './components/Card.vue';
import Video from './components/Video.vue';

const app = createApp(App);
const pinia = createPinia();

app.component('Card', Card);
app.component('Video', Video);

app.use(router);
app.use(pinia);

app.mount('#app');
