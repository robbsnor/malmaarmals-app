<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import Player from './components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useAppStore } from '../shared/stores/app.store';
import Chat from './components/Chat.vue';
import Info from './components/Info.vue';
import Back from './components/Back.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import type { VideoProgression } from './models/VideoProgression.model';
import { useVideoStore } from './stores/video.store';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const videoStore = useVideoStore();

onMounted(async () => {
    videoStore.videoId = route.params.id as string;
    appStore.player.isActive = true;
    appStore.player.isMini = false;

    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    appStore.player.isMini = true;
});
</script>
