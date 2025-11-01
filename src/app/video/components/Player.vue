<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '../../shared/stores/app.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const { isFullscreen, enter, exit, toggle } = useFullscreen();

onMounted(async () => {
    // videoStore.playing = false;
    videoStore.loadVideoProgression();
    await nextTick();
    videoStore.setVideoRef(videoRef.value);
    // videoStore.playing = true;
});
</script>

<template>
    <div class="relative h-full w-full aspect-video flex flex-col items-center justify-center">
        <video
            preload="metadata"
            class="aspect-video w-full"
            ref="videoRef"
            :src="videoStore.videoSrc"
            :poster="BucketHelper.getThumbnailUrl(Number(videoStore.videoId))"
        ></video>

        <div class="absolute inset-0" @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"></div>

        <!-- controls -->
        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>
