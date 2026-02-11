<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '../../shared/stores/app.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';
import Facecam from './Facecam.vue';
import { Z } from '../../shared/directives/z.directive';
import VideoInfo from './VideoInfo.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const { isFullscreen, enter, exit, toggle } = useFullscreen();

onMounted(async () => {
    await nextTick();
    videoStore.setVideoRef(videoRef.value);
    videoStore.showControllsAndInfo = true;

    videoStore.videoRef.addEventListener('loadeddata', async () => {
        videoStore.fetchMessages();
        videoStore.loadVideoProgression();
    });
});
</script>

<template>
    <div class="relative w-full h-full">
        <video
            preload="metadata"
            class="w-full h-full object-contain"
            :class="videoStore.theaterMode ? '' : '4xl:max-h-[82vh]'"
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
