<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { useFullscreen } from '@vueuse/core';
import { useAppStore } from '../../shared/stores/app.store';
import MiniplayerControls from './MiniplayerControls.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlayerControls from './PlayerControls.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';

const appStore = useAppStore();
const videoStore = useVideoStore();
const preferenceStore = usePreferenceStore();
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
        <div class="relative aspect-video w-full">
            <video
                preload="metadata"
                class="aspect-video w-full"
                ref="videoRef"
                :src="videoStore.videoSrc"
                :poster="BucketHelper.getThumbnailUrl(Number(videoStore.videoId))"
            />

            <div
                v-if="preferenceStore.preferences.showFacecam"
                class="aspect-video w-[30%] absolute bottom-2 right-2 overflow-hidden rounded-md shadow-lg"
            >
                <img src="/images/facecam.jpg" class="object-fill w-full h-full" alt="Malse Facecam" />
                <a
                    class="absolute right-0 bottom-0 text-muted-more text-xs underline p-0.5"
                    href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
                    target="_blank"
                >
                    @braxshinoa
                </a>
            </div>
        </div>

        <div class="absolute inset-0" @click="videoStore.showControllsAndInfo = !videoStore.showControllsAndInfo"></div>

        <!-- controls -->
        <PlayerControls />
        <MiniplayerControls />
    </div>
</template>
