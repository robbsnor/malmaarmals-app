<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';
import FloatingEmotes from './FloatingEmotes.vue';
import Facecam from './Facecam.vue';
import { Z } from '../../shared/directives/z.directive';

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

        <!-- poster overlay while casting -->
        <Transition name="fade">
            <img
                v-if="videoStore.casting"
                :src="BucketHelper.getThumbnailUrl(Number(videoStore.id))"
                class="absolute inset-0 w-full h-full object-contain"
                :class="videoStore.theaterMode ? '' : 'max-h-[82vh]'"
            />
        </Transition>

        <div
            class="absolute inset-0"
            v-z="Z.VIDEO_CONTROLS_BG"
            @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"
        ></div>

        <!-- floating emotes -->
        <FloatingEmotes />
        <Facecam />
        <!-- controls -->
        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
