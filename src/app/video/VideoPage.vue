<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from './stores/video.store';
import { useAuthStore } from '../auth/stores/auth.store';
import VideoNotAllowed from './components/VideoNotAllowed.vue';

const route = useRoute();
const videoStore = useVideoStore();
const authStore = useAuthStore();

onMounted(async () => {
    videoStore.player.isActive = true;
    videoStore.player.isMini = false;

    const isSamePage = (route.params.id as string) === videoStore.videoId;
    if (isSamePage) return;
    if (!authStore.canWatch) return;

    videoStore.videoId = route.params.id as string;
    videoStore.currentTime = 0;
    videoStore.duration = 0;

    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    videoStore.player.isMini = true;
});
</script>

<template>
    <VideoNotAllowed />
</template>
