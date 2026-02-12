<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import { Z } from '../../shared/directives/z.directive';
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useWindowSize } from '@vueuse/core';
import VideoInfo from './VideoInfo.vue';
import { useDisplay } from 'vuetify';
import ExtraInfoPlaylist from './ExtraInfoPlaylist.vue';
import ExtraInfoMessages from './ExtraInfoMessages.vue';

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
</script>

<template>
    <div
        ref="videoContainerRef"
        v-if="videoStore.playerIsActive && authStore.isSubbed"
        class="fixed bg-black flex flex-col md:flex-row flex-nowrap"
        v-z="Z.VIDEO_CONTAINER"
        :class="
            videoStore.playerIsMini
                ? 'right-4 bottom-[100px] w-[200px] lg:w-[350px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0 '
        "
    >
        <div class="md:overflow-auto md:grow scroll-hidden">
            <div
                ref="containerRef"
                class="md:flex md:items-center md:justify-center overflow-hidden max-h-screen"
                :class="videoStore.theaterMode ? 'md:h-full' : ''"
            >
                <Player ref="videoRef" />
            </div>

            <template v-if="!videoStore.playerIsMini">
                <!-- info -->
                <VideoInfo :class="videoStore.theaterMode ? 'md:hidden' : 'md:block'" class=" "></VideoInfo>

                <div
                    :class="videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0  '"
                    class="max-md:absolute max-md:overflow-auto w-full transition-opacity grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-4 p-4"
                >
                    <ExtraInfoPlaylist />

                    <ExtraInfoMessages />
                </div>

                <!-- <div
                    :class="
                        videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0 pointer-events-none'
                    "
                    class="max-md:absolute max-md:overflow-auto w-full bg-black-300 transition-opacity"
                >
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4">
                        <div v-for="n in 100" :key="n" class="aspect-video bg-black-200 rounded"></div>
                    </div>
                </div> -->
            </template>
        </div>

        <Chat />
    </div>
</template>
