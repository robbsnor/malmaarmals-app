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
    <div class="relative h-full w-full aspect-video flex flex-col items-center justify-center">
        <div class="relative aspect-video w-full">
            <!-- <canvas
                ref="canvasRef"
                class="absolute top-1/2 left-1/2 size-[120%] -translate-1/2 blur-[60px] transition-all pointer-events-none select-none opacity-f50"
            ></canvas> -->

            <video
                preload="metadata"
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

        <div
            v-if="videoStore.videoSrcNotFound && !videoStore.playerIsMini"
            class="absolute inset-0 bg-black flex items-center justify-center"
            v-z="Z.VIDEO_SRC_ERROR"
        >
            <Empty title="Video not found." icon="mdi-cancel" description="lekkerAppie">
                <v-btn variant="tonal" color="primary" :to="{ name: 'archive' }">Browse streams</v-btn>
            </Empty>
        </div>
    </div>
</template>
