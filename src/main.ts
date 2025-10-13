import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';

import BottomSheetContainer from './app/shared/components/BottomSheetContainer.vue';
import Card from './app/shared/components/Card.vue';
import Container from './app/shared/components/Container.vue';
import Dev from './app/shared/components/Dev.vue';
import Dialog from './app/shared/components/Dialog.vue';
import GradientText from './app/shared/components/GradientText.vue';
import GridSection from './app/shared/components/GridSection.vue';
import Logo from './app/shared/components/Logo.vue';
import Section from './app/shared/components/Section.vue';
import Skeleton from './app/shared/components/Skeleton.vue';
import VideoThumbnail from './app/shared/components/VideoThumbnail.vue';
import { visible } from './app/shared/directives/visible.directive';

import { vuetify } from './vuetify.config';
import './style.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// components
app.component('BottomSheetContainer', BottomSheetContainer);
app.component('Card', Card);
app.component('Container', Container);
app.component('Dev', Dev);
app.component('Dialog', Dialog);
app.component('GradientText', GradientText);
app.component('GridSection', GridSection);
app.component('Logo', Logo);
app.component('Section', Section);
app.component('Skeleton', Skeleton);
app.component('VideoThumbnail', VideoThumbnail);

// directives
app.directive('visible', visible);

// plugins
app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(autoAnimatePlugin);

app.mount('#app');
