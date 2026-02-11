<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from './stores/video.store';
import { useAuthStore } from '../auth/stores/auth.store';
import VideoNotAllowed from './components/VideoNotAllowed.vue';
import { useHistoryStore } from '../history/stores/history.store';
import { TitleHelper } from '../shared/helpers/title.helper';

const route = useRoute();
const videoStore = useVideoStore();
const authStore = useAuthStore();
const historyStore = useHistoryStore();

onMounted(async () => {
    videoStore.playerIsActive = true;
    videoStore.playerIsMini = false;
    const videoId = Number(route.params.id);

    const isSamePage = videoId === videoStore.id;
    if (isSamePage) return;
    if (!authStore.isSubbed) return;

    videoStore.reset();
    videoStore.id = videoId;

    await videoStore.fetchInfo();
    await videoStore.setSrc();
    TitleHelper.setTitle(videoStore.info.title);

    await videoStore.fetchChapters();
    await historyStore.add();
});

onUnmounted(() => {
    videoStore.playerIsMini = true;
});
</script>

<template>
    <VideoNotAllowed />
</template>
