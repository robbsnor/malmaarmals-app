<script setup lang="ts">
import { useFullscreen, useScreenOrientation } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideoStore } from '../stores/video.store';

const poo = ref(false);

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

onMounted(() => {
    handleAutoFullscreen();
});

const handleAutoFullscreen = async () => {
    if (!isSupportedScreenOrientation.value && !isSupportedFullscreen.value) return;

    const isLandscape = orientation.value?.includes('landscape');

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
    async () => {
        handleAutoFullscreen();
    }
);
</script>

<template>
    <div
        v-if="appStore.player.isActive"
        class="fixed bg-black z-100 flex flex-col md:flex-row"
        :class="
            appStore.player.isMini
                ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0'
        "
    >
        <div class="md:overflow-auto md:scroll-hidden">
            <Player />
            <!-- <Info /> -->
            <!-- <InfoLarge /> -->
        </div>

        <Chat class="shrink-0 w-full md:w-[250px]" />
    </div>
</template>
