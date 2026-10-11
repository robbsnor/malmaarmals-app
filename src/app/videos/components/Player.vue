<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useVideoStore } from '../stores/video.store';
import CastingPoster from './CastingPoster.vue';
import Facecam from './Facecam.vue';
import FloatingEmotes from './FloatingEmotes.vue';
import MiniplayerControls from './MiniplayerControls.vue';
import PlayerControls from './PlayerControls.vue';

const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const time = useRouteQuery<number>('t');

onMounted(async () => {
    await nextTick();

    videoStore.setVideoRef(videoRef.value);
    videoStore.showControllsAndInfo = true;
});

async function onLoadedData() {
    videoStore.loadVideoProgression(time.value);
    videoStore.showControllsAndInfo = false;
    await videoStore.fetchMessages();
}
</script>

<template>
    <div class="relative w-full h-full">
        <video
            preload="metadata"
            class="w-full h-full object-contain aspect-video"
            :class="{ 'max-h-[82vh]': !videoStore.theaterMode }"
            ref="videoRef"
            :src="videoStore.src"
            :poster="BucketHelper.getThumbnailUrl(Number(videoStore.id))"
            @loadeddata="onLoadedData"
        ></video>

        <CastingPoster />

        <div
            class="z-video-controls-bg absolute inset-0"
            @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"
        ></div>

        <Facecam />
        <FloatingEmotes />

        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>
