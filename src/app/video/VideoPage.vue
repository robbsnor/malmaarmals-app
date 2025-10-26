<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../shared/stores/app.store';
import { useVideoStore } from './stores/video.store';
import { useAuthStore } from '../auth/stores/auth.store';

const route = useRoute();
const videoStore = useVideoStore();
const authStore = useAuthStore();

onMounted(async () => {
    videoStore.player.isActive = true;
    videoStore.player.isMini = false;

    const isSamePage = (route.params.id as string) === videoStore.videoId;
    if (isSamePage) return;
    if (!authStore.isSubbed) return;

    videoStore.videoId = route.params.id as string;
    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    videoStore.player.isMini = true;
});
</script>

<template></template>
