import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';
import './style.css';

import Card from './app/shared/components/Card.vue';
import Container from './app/shared/components/Container.vue';
import GradientText from './app/shared/components/GradientText.vue';
import GridSection from './app/shared/components/GridSection.vue';
import Player from './app/shared/components/Player.vue';
// import Video from './app/shared/components/Video.vue';
import VideoThumbnail from './app/shared/components/VideoThumbnail.vue';

const app = createApp(App);
const pinia = createPinia();

// components
app.component('Card', Card);
app.component('Container', Container);
app.component('GradientText', GradientText);
app.component('GridSection', GridSection);
app.component('Player', Player);
// app.component('Video', Video);
app.component('VideoThumbnail', VideoThumbnail);

// plugins
app.use(router);
app.use(ui);
app.use(pinia);

app.mount('#app');
