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
        <div class="bg-red-500 md:overflow-auto md:grow">
            <div
                ref="containerRef"
                class="bg-lime-500 md:flex md:items-center md:justify-center overflow-hidden max-h-screen"
                :class="videoStore.theaterMode ? 'md:h-full' : ''"
            >
                <Player ref="videoRef" />
            </div>

            <!-- info -->
            <VideoInfo
                :class="videoStore.theaterMode ? 'md:hidden' : 'md:block'"
                class="bg-fuchsia-700! relative"
            ></VideoInfo>

            <div
                :class="videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0 pointer-events-none'"
                class="max-md:absolute max-md:overflow-auto w-full bg-fuchsia-300 transition-opacity"
            >
                <div class="flex flex-wrap justify-center p-2 gap-2">
                    <div v-for="n in 100" :key="n" class="aspect-video bg-amber-400 h-20"></div>
                </div>
            </div>
        </div>

        <div
            :class="videoStore.showChat ? 'md:block' : 'md:hidden'"
            class="chat shrink-0 bg-orange-400 overflow-auto md:shrink-0 md:w-[200px] lg:w-[300px] lg:bg-blue-500 xl:w-[400px] xl:bg-red-500 4xl:w-[500px] 4xl:bg-green-500"
        >
            <div v-for="n in 100" :key="n">{{ n }}</div>
        </div>
    </div>
</template>
