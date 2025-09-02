import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';
import './style.css';

import Card from './app/shared/components/Card.vue';
import Video from './app/shared/components/Video.vue';

const app = createApp(App);
const pinia = createPinia();

app.component('Card', Card);
app.component('Video', Video);

app.use(router);
app.use(ui);
app.use(VuePlyr);
app.use(pinia);

app.mount('#app');
