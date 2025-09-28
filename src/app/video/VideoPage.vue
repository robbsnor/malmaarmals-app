<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useAppStore } from '../shared/stores/app.store';
import Chat from './components/Chat.vue';
import Info from './components/Info.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import type { VideoProgression } from './models/VideoProgression.model';
import { useVideoStore } from './stores/video.store';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const videoStore = useVideoStore();
const { lgAndUp } = useDisplay();

const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');

const options = computed(() => ({
    controls: playerDefaultOptions.controls.filter((item: any) => !['pip', 'volfume', 'mute'].includes(item)),
    markers: {
        enabled: true,
        points: videoStore.chapters.map((chapter) => ({
            time: chapter.start_s,
            label: chapter.title,
        })),
    },
}));

const seekToChapter = (seconds: number) => {
    playerRef.value.videoRef.currentTime = seconds;
    playerRef.value.videoRef.play();
};

const updateVideoTime = (e: any | any) => {
    const time = Math.floor(e.target.currentTime);
    if (!e || !time) return; // bc 2 different events
    if (videoStore.videoTime === time) return;

    videoStore.videoTime = time;
};

watch(lgAndUp, (isTrue) => (isTrue ? appStore.showHeader() : appStore.hideHeader()));

const setRememberedVideoTime = () => {
    const timeObj: VideoProgression = JSON.parse(localStorage.getItem(videoStore.videoId));
    if (!timeObj) return;
    if (timeObj.percentage > 90) return;

    playerRef.value.videoRef.currentTime = Number(timeObj.current_time_s);
};

onMounted(async () => {
    videoStore.videoId = route.params.id as string;

    if (lgAndUp.value) {
        appStore.showHeader();
    } else {
        appStore.hideHeader();
    }

    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

watch(playerRef, () => {
    if (!playerRef.value) return;

    playerRef.value.player.on('controlsshown', () => {
        videoStore.showInfo = true;
    });
    playerRef.value.player.on('controlshidden', () => {
        videoStore.showInfo = false;
    });
    playerRef.value.player.on('ready', () => {
        setRememberedVideoTime();
    });
});

onUnmounted(() => {
    appStore.showHeader();
});
</script>

<template>
    <div v-if="videoStore.videoInfo" class="h-available overflow-hidden flex flex-col md:flex-row">
        <div class="relative md:grow md:overflow-auto lg:p-4 lg:pr-0">
            <div class="h-full lg:h-auto xl:max-h-[calc(var(--height-available)-48fpx-84px)]">
                <Player
                    :options="options"
                    @timeupdate="updateVideoTime"
                    ref="playerRef"
                    :stretchHeight="true"
                    class="lg:rounded-md overflow-hidden"
                >
                    <source :src="`http://localhost:8000/videos/${videoStore.videoId}`" type="video/mp4" />
                </Player>
            </div>

            <InfoDesktop @clickChapter="seekToChapter($event.start_s)" />
            <Info @clickChapter="seekToChapter($event.start_s)" />
        </div>

        <div class="relative overflow-hidden grow-1 shrink-0 md:grow-0 md:basis-[220px] lg:basis-[320px]">
            <Chat :videoId="Number(videoStore.videoId)" :videoTime="videoStore.videoTime" />
        </div>
    </div>
</template>
