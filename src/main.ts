import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';

import Auth from './app/shared/components/Auth.vue';
import Card from './app/shared/components/Card.vue';
import ConfirmDialog from './app/shared/components/ConfirmDialog.vue';
import Container from './app/shared/components/Container.vue';
import DeleteDialog from './app/shared/components/DeleteDialog.vue';
import Dev from './app/shared/components/Dev.vue';
import Dialog from './app/shared/components/Dialog.vue';
import Drawer from './app/shared/components/Drawer.vue';
import Empty from './app/shared/components/Empty.vue';
import GradientText from './app/shared/components/GradientText.vue';
import GridSection from './app/shared/components/GridSection.vue';
import Logo from './app/shared/components/Logo.vue';
import SafeArea from './app/shared/components/SafeArea.vue';
import Section from './app/shared/components/Section.vue';
import Skeleton from './app/shared/components/Skeleton.vue';
import SkeletonContainer from './app/shared/components/SkeletonContainer.vue';
import VideoThumbnail from './app/shared/components/VideoThumbnail.vue';

import { visible } from './app/shared/directives/visible.directive';
import { z } from './app/shared/directives/z.directive';

import { vuetify } from './vuetify.config';
import './style.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// components
app.component('Auth', Auth);
app.component('Card', Card);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Container', Container);
app.component('DeleteDialog', DeleteDialog);
app.component('Dev', Dev);
app.component('Dialog', Dialog);
app.component('Drawer', Drawer);
app.component('Empty', Empty);
app.component('GradientText', GradientText);
app.component('GridSection', GridSection);
app.component('Logo', Logo);
app.component('SafeArea', SafeArea);
app.component('Section', Section);
app.component('Skeleton', Skeleton);
app.component('SkeletonContainer', SkeletonContainer);
app.component('VideoThumbnail', VideoThumbnail);

// directives
app.directive('visible', visible);
app.directive('z', z);

// plugins
app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(autoAnimatePlugin);

app.mount('#app');
