<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { supabase } from '../../supabase';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useAppStore } from '../shared/stores/app.store';
import type { Tables } from '../shared/types/database.types';
import Chat from './components/Chat.vue';
import Info from './components/Info.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import { CHAPTERS_MOCK } from './data/chapters.mock';
import type { VideoTimeProgression } from './models/VideoTimeProgression.model';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const { mdAndUp, lgAndUp } = useDisplay();
const videoId = route.params.id as string;

const videoInfo = ref<Tables<'videos'>>();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const showInfo = ref(false);

const chapters = ref(CHAPTERS_MOCK);

const options = computed(() => ({
    controls: playerDefaultOptions.controls.filter((item: any) => !['pip', 'volfume', 'mute'].includes(item)),
    markers: {
        enabled: true,
        points: chapters.value.map((chapter) => ({
            time: chapter.start_s,
            label: chapter.title,
        })),
    },
}));

const seekToChapter = (seconds: number) => {
    playerRef.value.videoRef.currentTime = seconds;
    playerRef.value.videoRef.play();
};

const getVideoInfo = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(videoId)).single();
    if (error) return console.error('Error fetching videos:', error);

    videoInfo.value = data;
    TitleHelper.setTitle(data.title);
};

const updateVideoTime = (e: any | any) => {
    const time = Math.floor(e.target.currentTime);
    if (!e || !time) return; // bc 2 different events
    if (videoTime.value === time) return;

    videoTime.value = time;
};

watch(lgAndUp, (isTrue) => {
    isTrue ? appStore.showHeader() : appStore.hideHeader();
});

watch(videoTime, (newValue) => {
    const obj: VideoTimeProgression = {
        current_time_s: newValue,
        total_time_s: videoInfo.value.length_sec,
        percentage: Math.round((100 / videoInfo.value.length_sec) * videoTime.value),
    };
    localStorage.setItem(videoId, JSON.stringify(obj));
});

const setOldVideoTime = () => {
    const timeObj: VideoTimeProgression = JSON.parse(localStorage.getItem(videoId));
    if (!timeObj) return;

    playerRef.value.videoRef.currentTime = Number(timeObj.current_time_s);
};

onMounted(async () => {
    if (lgAndUp.value) {
        appStore.showHeader();
    } else {
        appStore.hideHeader();
    }

    await getVideoInfo();
    setOldVideoTime();

    playerRef.value.player.on('controlsshown', () => {
        showInfo.value = true;
    });
    playerRef.value.player.on('controlshidden', () => {
        showInfo.value = false;
    });
});

onUnmounted(() => {
    appStore.showHeader();
});
</script>

<template>
    <div v-if="videoInfo" class="h-available overflow-hidden flex flex-col md:flex-row">
        <div class="relative md:grow md:overflow-auto lg:p-4 lg:pr-0 xl:pr-2">
            <div class="h-full lg:h-auto xl:h-[calc(var(--height-available)-48fpx-84px)]">
                <Player
                    :options="options"
                    @timeupdate="updateVideoTime"
                    ref="playerRef"
                    :stretchHeight="true"
                    class="lg:rounded-md overflow-hidden"
                >
                    <source :src="`http://localhost:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                </Player>
            </div>

            <InfoDesktop :videoInfo="videoInfo" :chapters="chapters" @clickChapter="seekToChapter($event.start_s)" />
            <Info
                :showInfo="showInfo"
                :videoInfo="videoInfo"
                :chapters="chapters"
                @clickChapter="seekToChapter($event.start_s)"
            />
        </div>

        <div class="relative overflow-hidden grow-1 shrink-0 md:grow-0 md:basis-[220px] lg:basis-[320px]">
            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div>
    </div>
</template>
