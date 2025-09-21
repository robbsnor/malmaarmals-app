import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';

import Card from './app/shared/components/Card.vue';
import Container from './app/shared/components/Container.vue';
import Dev from './app/shared/components/Dev.vue';
import GradientText from './app/shared/components/GradientText.vue';
import GridSection from './app/shared/components/GridSection.vue';
import Player from './app/shared/components/Player.vue';
import Section from './app/shared/components/Section.vue';
import Stroke from './app/shared/components/Stroke.vue';
// import Video from './app/shared/components/Video.vue';
import VideoThumbnail from './app/shared/components/VideoThumbnail.vue';

import { vuetify } from './vuetify.config';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

// components
app.component('Card', Card);
app.component('Container', Container);
app.component('Dev', Dev);
app.component('GradientText', GradientText);
app.component('GridSection', GridSection);
app.component('Player', Player);
app.component('Section', Section);
app.component('Stroke', Stroke);
// app.component('Video', Video);
app.component('VideoThumbnail', VideoThumbnail);

// plugins
app.use(router);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
