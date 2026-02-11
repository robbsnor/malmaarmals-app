<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';

const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

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
            class="w-full h-full object-contain aspect-video"
            :class="videoStore.theaterMode ? '' : 'max-h-[82vh]'"
            ref="videoRef"
            :src="videoStore.src"
            :poster="BucketHelper.getThumbnailUrl(Number(videoStore.id))"
        ></video>

        <div class="absolute inset-0" @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"></div>

        <!-- controls -->
        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>
