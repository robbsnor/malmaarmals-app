<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import Player from './components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useAppStore } from '../shared/stores/app.store';
import Chat from './components/Chat.vue';
import Info from './components/Info.vue';
import Back from './components/Back.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import type { VideoProgression } from './models/VideoProgression.model';
import { useVideoStore } from './stores/video.store';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const videoStore = useVideoStore();
const { lgAndUp } = useDisplay();

watch(lgAndUp, (isTrue) => (isTrue ? appStore.showHeader() : appStore.hideHeader()));

onMounted(async () => {
    videoStore.videoId = route.params.id as string;

    if (lgAndUp.value) {
        appStore.showHeader();
    } else {
        appStore.hideHeader();
    }

    await videoStore.fetchVideoInfo();
    videoStore.loadVideoProgression();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    appStore.showHeader();
});
</script>

<template>
    <div v-if="videoStore.videoInfo" class="h-available overflow-hidden flex flex-col md:flex-row">
        <div class="relative md:grow md:overflow-auto lg:p-4 lg:pr-0 md:scroll-hidden poo">
            <div class="h-full lg:h-auto xl:max-h-[calc(var(--height-available)-48fpx-84px)]">
                <Player />
            </div>

            <Back />
            <InfoDesktop />
            <Info />
        </div>

        <div class="relative overflow-hidden grow-1 shrink-0 md:grow-0 md:basis-[220px] lg:basis-[320px]">
            <Chat />
        </div>
    </div>
</template>
