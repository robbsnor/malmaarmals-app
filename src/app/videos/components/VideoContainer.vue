<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import { Z } from '../../shared/directives/z.directive';
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useWindowSize } from '@vueuse/core';
import VideoInfo from './VideoInfo.vue';
import { useDisplay } from 'vuetify';
import ExtraInfoPlaylist from './ExtraInfoPlaylist.vue';
import ExtraInfoMessages from './ExtraInfoMessages.vue';
import ExtraInfoChapters from './ExtraInfoChapters.vue';
import ExtraInfoItem from './ExtraInfoItem.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
const { xs } = useDisplay();

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const videoColRef = useTemplateRef<HTMLElement>('videoColRef');
const videoRef = useTemplateRef<HTMLElement>('videoRef');
const infoRef = useTemplateRef<HTMLElement>('infoRef');

const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
const { width: videoWidth, height: videoHeight } = useElementSize(videoRef);
const { width: infoWidth, height: infoHeight } = useElementSize(infoRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();

const isMaxHeight = computed(() => containerHeight.value + infoHeight.value >= windowHeight.value);
const containerMaxHeight = computed(() => windowHeight.value - infoHeight.value);

const containerClasses = computed(() => {
    if (videoStore.playerIsMini) {
        return 'border-black-500 right-4 bottom-[100px] aspect-video w-[200px] overflow-hidden rounded-md border shadow-[0_0_20px_rgba(0,0,0,1)] lg:w-[350px] 2xl:right-8 2xl:bottom-8';
    }
    if (videoStore.theaterMode) {
        return 'top-0 right-0 bottom-0 left-0';
    }
    return 'lg:top-header top-0 right-0 bottom-0 left-0';
});

watch(containerRef, (el) => (videoStore.videoContainerRef = el));
watch(videoColRef, (el) => (videoStore.videoColRef = el));
</script>

<template>
    <div
        ref="videoContainerRef"
        v-if="videoStore.playerIsActive && authStore.isSubbed"
        class="fixed flex flex-col flex-nowrap bg-black md:flex-row"
        v-z="Z.VIDEO_CONTAINER"
        :class="containerClasses"
    >
        <div ref="videoColRef" class="scroll-hidden bg-black-100 md:grow md:overflow-auto">
            <div
                ref="containerRef"
                class="max-h-screen overflow-hidden bg-black md:flex md:items-center md:justify-center"
                :class="videoStore.theaterMode ? 'md:h-full' : ''"
            >
                <Player ref="videoRef" />
            </div>

            <template v-if="!videoStore.playerIsMini">
                <!-- info -->
                <VideoInfo :class="videoStore.theaterMode ? 'md:hidden' : 'md:block'" class=" "></VideoInfo>

                <Container
                    :class="videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0'"
                    :padding="false"
                >
                    <div
                        class="grid w-full grid-cols-[repeat(auto-fill,minmax(450px,1fr))] gap-4 p-4 transition-opacity items-start max-md:absolute max-md:overflow-auto lg:gap-8 lg:p-8"
                    >
                        <ExtraInfoChapters />
                        <ExtraInfoPlaylist />
                        <ExtraInfoMessages />
                    </div>
                </Container>

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
