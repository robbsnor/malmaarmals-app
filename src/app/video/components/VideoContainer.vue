<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import Info from './Info.vue';
import { Z } from '../../shared/directives/z.directive';
import { computed, nextTick, ref, useTemplateRef, watch, type StyleValue } from 'vue';
import { useElementSize, useTransition } from '@vueuse/core';
import { sleep } from '../../shared/helpers/sleep';
import { useWindowSize } from '@vueuse/core';
import VideoInfo from './VideoInfo.vue';
import { useDisplay } from 'vuetify';

const videoStore = useVideoStore();
const authStore = useAuthStore();
const { xs } = useDisplay();

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const videoRef = useTemplateRef<HTMLElement>('videoRef');
const infoRef = useTemplateRef<HTMLElement>('infoRef');

const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
const { width: videoWidth, height: videoHeight } = useElementSize(videoRef);
const { width: infoWidth, height: infoHeight } = useElementSize(infoRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();

const isMaxHeight = computed(() => containerHeight.value + infoHeight.value >= windowHeight.value);
const containerMaxHeight = computed(() => windowHeight.value - infoHeight.value);

const containerClasses = computed(() => {
    return [videoStore.theaterMode ? 'md:h-full' : ''];
});
</script>

<template>
    <div
        v-if="videoStore.playerIsActive && authStore.isSubbed"
        class="fixed bg-green-800 flex flex-col md:flex-row flex-nowrap"
        v-z="Z.VIDEO_CONTAINER"
        :class="
            videoStore.playerIsMini
                ? 'right-4 bottom-[100px] w-[200px] lg:w-[350px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0 '
        "
    >
        <div class="absolute top-0 p-4 bg-red-400 z-90">{{ videoStore.theaterMode }}</div>
        <div class="bg-red-500 md:overflow-auto md:grow">
            <div
                ref="containerRef"
                class="bg-lime-500 md:flex md:items-center md:justify-center overflow-hidden max-h-screen"
                :class="containerClasses"
            >
                <Player ref="videoRef" />
            </div>

            <!-- mobile vertical -->
            <VideoInfo class="bg-blue-700! md:hidden relative z-60"></VideoInfo>

            <!-- info mobile vertical and above -->
            <!-- <div class="bg-fuchsia-300 w-full hidden md:block">
                <VideoInfo v-if="!videoStore.theaterMode" class="bg-fuchsia-700!"></VideoInfo>
                <div class="flex flex-wrap gap-2">
                    <div v-for="n in 100" :key="n" class="aspect-video bg-amber-400 h-20"></div>
                </div>
            </div> -->
        </div>

        <div v-if="videoStore.showChat || xs" class="chat bg-orange-400 overflow-auto md:shrink-0 md:w-[200px]">
            <div v-for="n in 100" :key="n">{{ n }}</div>
        </div>
    </div>
</template>
