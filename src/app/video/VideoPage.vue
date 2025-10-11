<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../shared/stores/app.store';
import { useVideoStore } from './stores/video.store';
import { useScreenOrientation } from '@vueuse/core';
import { useFullscreen } from '@vueuse/core';

const route = useRoute();
const appStore = useAppStore();
const videoStore = useVideoStore();
const {
    isSupported: isSupportedScreenOrientation,
    orientation,
    angle,
    lockOrientation,
    unlockOrientation,
} = useScreenOrientation();
const { isFullscreen, enter, exit, toggle, isSupported: isSupportedFullscreen } = useFullscreen();

onMounted(async () => {
    videoStore.videoId = route.params.id as string;
    appStore.player.isActive = true;
    appStore.player.isMini = false;

    handleAutoFullscreen();
    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    appStore.player.isMini = true;
});

const handleAutoFullscreen = async () => {
    if (!isSupportedScreenOrientation.value && !isSupportedFullscreen.value) return;

    const isLandscape = orientation.value?.includes('landscape');
    alert(orientation.value);

    if (isLandscape) {
        await enter();
        // await lockOrientation('landscape');
    } else {
        await exit();
        // unlockOrientation();
    }
};

watch(
    () => orientation.value,
    () => {
        handleAutoFullscreen();
    }
);
</script>

<template></template>
