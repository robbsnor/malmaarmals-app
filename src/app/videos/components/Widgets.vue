<script setup lang="ts">
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { MasonryWall } from '@yeger/vue-masonry-wall';
import { computed, ref } from 'vue';
import { useAppStore } from '../../shared/stores/app.store.ts';
import { useVideoStore } from '../stores/video.store.ts';
import VideoInfo from './VideoInfo.vue';
import ChaptersWidget from './widgets/ChaptersWidget.vue';
import ChatStatsWidget from './widgets/ChatStatsWidget.vue';
import MessagesWidget from './widgets/MessagesWidget.vue';
import PlaylistWidget from './widgets/PlaylistWidget.vue';
import TeamWidget from './widgets/TeamWidget.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();

const widgets = [ChatStatsWidget, ChaptersWidget, PlaylistWidget, TeamWidget, MessagesWidget];
const { height: windowHeight } = useWindowSize();
const el = ref();
// @ts-ignore
const { top } = useElementBounding(el);
const portraitHeight = computed(() => (appStore.isLandscape ? null : `${windowHeight.value - top.value}px`));
</script>

<template>
    <div v-if="!videoStore.playerIsMini" class="relative">
        <VideoInfo
            v-if="!appStore.isLandscape || (appStore.isLandscape && !videoStore.theaterMode)"
            class="relative z-2"
        ></VideoInfo>

        <v-slide-y-transition>
            <div
                v-show="appStore.isLandscape || videoStore.showWidgetsMobile"
                ref="el"
                class="bg-black-100"
                :style="{ height: portraitHeight }"
                :class="{ 'overflow-auto absolute z-1 w-full': !appStore.isLandscape }"
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
                            <component :is="widget" class="mb-[10px]" />
                        </template>
                    </MasonryWall>
                </Container>

                <div class="relative opacity-50">
                    <img class="relative left-4 -bottom-4 w-30" src="/images/painted-emotes/lekkerHoor.png" alt="" />
                </div>
            </div>
        </v-slide-y-transition>
    </div>
</template>

<style scoped>
/* hide components that do not render due to v-if'd */
:deep(.masonry-item:empty) {
    display: none;
}
</style>
