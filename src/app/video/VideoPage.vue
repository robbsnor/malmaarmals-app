<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from './stores/video.store';
import { useAuthStore } from '../auth/stores/auth.store';
import VideoNotAllowed from './components/VideoNotAllowed.vue';
import { useHistoryStore } from './stores/history.store';

const route = useRoute();
const videoStore = useVideoStore();
const authStore = useAuthStore();
const historyStore = useHistoryStore();

onMounted(async () => {
    videoStore.playerIsActive = true;
    videoStore.playerIsMini = false;
    const videoId = Number(route.params.id);

    const isSamePage = videoId === videoStore.videoId;
    if (isSamePage) return;
    if (!authStore.isSubbed) return;

    videoStore.reset();
    videoStore.videoId = videoId;

    await videoStore.fetchVideoInfo();
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
