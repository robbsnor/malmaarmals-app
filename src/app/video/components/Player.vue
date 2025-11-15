<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '../../shared/stores/app.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';
import Facecam from './Facecam.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
const { isFullscreen, enter, exit, toggle } = useFullscreen();

onMounted(async () => {
    await nextTick();
    videoStore.setVideoRef(videoRef.value);

    videoStore.videoRef.addEventListener('canplay', async () => {
        console.log('canplay');
        videoStore.fetchMessages();
        videoStore.loadVideoProgression();
    });

    // const ctx = canvasRef.value.getContext('2d');

    // async function draw() {
    //     canvasRef.value.width = videoRef.value.videoWidth;
    //     canvasRef.value.height = videoRef.value.videoHeight;

    //     ctx.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
    //     await sleep(1000 / 24);
    //     requestAnimationFrame(draw);
    // }

    // videoRef.value.addEventListener('play', draw);
});
</script>

<template>
    <div class="relative h-full w-full aspect-video flex flex-col items-center justify-center">
        <div class="relative aspect-video w-full">
            <!-- <canvas
                ref="canvasRef"
                class="absolute top-1/2 left-1/2 size-[120%] -translate-1/2 blur-[60px] transition-all pointer-events-none select-none opacity-f50"
            ></canvas> -->

            <video
                preload="metadata"
                id="videoMain"
                class="relative aspect-video w-full md:rounded-md"
                ref="videoRef"
                :src="videoStore.videoSrc"
                :poster="BucketHelper.getThumbnailUrl(Number(videoStore.videoId))"
            />

            <Facecam />
        </div>

        <div class="absolute inset-0" @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"></div>

        <!-- controls -->
        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>
