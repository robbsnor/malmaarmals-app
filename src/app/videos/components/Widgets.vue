<script setup lang="ts">
import { computed, ref } from 'vue';
import ChaptersWidget from './widgets/ChaptersWidget.vue';
import PlaylistWidget from './widgets/PlaylistWidget.vue';
import MessagesWidget from './widgets/MessagesWidget.vue';
import { useAppStore } from '../../shared/stores/app.store.ts';
import { useVideoStore } from '../stores/video.store.ts';
import VideoInfo from './VideoInfo.vue';
import InfoWidget from './widgets/InfoWidget.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
</script>

<template>
    <template v-if="!videoStore.playerIsMini">
        <!-- info -->
        <VideoInfo v-if="!appStore.isLandscape || (appStore.isLandscape && !videoStore.theaterMode)"></VideoInfo>

        <Container v-if="appStore.isLandscape" :padding="false">
            <div
                class="grid w-full grid-cols-[repeat(auto-fill,minmax(450px,1fr))] gap-16 p-4 transition-opacity items-start max-md:absolute max-md:overflow-auto lg:p-8"
            >
                <InfoWidget />
                <ChaptersWidget />
                <PlaylistWidget />
                <MessagesWidget />
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
</template>
