<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import ChaptersWidget from './widgets/ChaptersWidget.vue';
import PlaylistWidget from './widgets/PlaylistWidget.vue';
import MessagesWidget from './widgets/MessagesWidget.vue';
import { useAppStore } from '../../shared/stores/app.store.ts';
import { useVideoStore } from '../stores/video.store.ts';
import VideoInfo from './VideoInfo.vue';
import InfoWidget from './widgets/InfoWidget.vue';
import { MasonryWall } from '@yeger/vue-masonry-wall';
import { useElementSize, useWindowSize, useElementBounding } from '@vueuse/core';
import { sleep } from '../../shared/helpers/sleep.ts';

const appStore = useAppStore();
const videoStore = useVideoStore();

const widgets = [InfoWidget, ChaptersWidget, PlaylistWidget, MessagesWidget];
const { height: windowHeight } = useWindowSize();
const el = useTemplateRef('el');
// @ts-ignore
const { top } = useElementBounding(el);
const portraitHeight = computed(() => (appStore.isLandscape ? null : `${windowHeight.value - top.value}px`));
</script>

<template>
    <div v-if="!videoStore.playerIsMini" class="relative">
        <VideoInfo v-if="!appStore.isLandscape || (appStore.isLandscape && !videoStore.theaterMode)"></VideoInfo>
        <!-- <VideoInfo v-if="!videoStore.theaterMode"></VideoInfo> -->

        <div
            v-if="appStore.isLandscape || videoStore.showExtraInfoMobile"
            ref="el"
            class="bg-black-100"
            :style="{ height: portraitHeight }"
            :class="{ 'overflow-auto absolute z-10 w-full': !appStore.isLandscape }"
        >
            <Container :padding="false">
                <MasonryWall
                    :items="widgets"
                    :column-width="500"
                    :gap="60"
                    class="p-4"
                    :class="{ 'p-8': appStore.isLandscape }"
                >
                    <template #default="{ item: widget }">
                        <component :is="widget" class="pb-[30px]" />
                    </template>
                </MasonryWall>
            </Container>

            <div class="relative opacity-50">
                <img class="relative left-4 -bottom-4 w-30" src="/images/painted-emotes/lekkerHoor.png" alt="" />
            </div>
        </div>
    </div>
</template>

<style scoped>
/* hide components that do not render due to v-if'd */
:deep(.masonry-item:empty) {
    display: none;
}
</style>
