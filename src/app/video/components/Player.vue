<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useVideoStore } from '../stores/video.store';
import { useFullscreen } from '@vueuse/core';

const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');
const router = useRouter();
const { isFullscreen, enter, exit, toggle } = useFullscreen();

onMounted(async () => {
    videoStore.playing = false;
    videoStore.loadVideoProgression();
    await nextTick();
    videoStore.setVideoRef(videoRef.value);
    videoStore.playing = true;
});

const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="h-full relative flex items-center justify-center">
        <video
            @click="videoStore.showMobileControls = !videoStore.showMobileControls"
            controlsf
            class="aspect-video w-full"
            ref="videoRef"
            :src="videoStore.videoSrc"
        ></video>

        <!-- mobile -->
        <div v-visible="videoStore.showMobileControls" class="absolute inset-0 flex flex-col gap-4">
            <div class="absolute inset-0 bg-black/50" @click="videoStore.showMobileControls = false"></div>

            <div class="flex justify-between gap-4 p-2">
                <v-icon icon="mdi-chevron-left" @click="goBack()" />
                <div class="flex gap-4">
                    <v-icon icon="mdi-cog-outline" />
                    <v-icon icon="mdi-fullscreen" @click="toggle()" />
                </div>
            </div>

            <div class="flex justify-center items-center gap-4 grow p-2">
                <v-icon icon="mdi-rewind-5" size="24" @click="videoStore.currentTime -= 5" />
                <v-icon
                    :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
                    size="64"
                    @click="videoStore.playing = !videoStore.playing"
                />
                <v-icon icon="mdi-fast-forward-60" size="24" @click="videoStore.currentTime += 60" />
            </div>

            <div class="relative flex justify-between items-center px-2 py-1">
                <div class="min-w-14">{{ videoStore.prettyCurrentTime }}</div>
                <v-slider
                    v-model="videoStore.currentTime"
                    class="grow"
                    hide-details="auto"
                    thumb-size="12"
                    track-size="4"
                    color="primary"
                    :max="videoStore.duration"
                    :min="0"
                    :step="1"
                />
                <div class="min-w-14 text-right">{{ videoStore.prettyDuration }}</div>
            </div>
        </div>
    </div>
</template>
