<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef, watch, onUnmounted } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { useDisplay } from 'vuetify';
import { TitleHelper } from '../shared/helpers/title.helper';
import type { Tables } from '../shared/types/database.types';
import Info from './components/Info.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import { useAppStore } from '../shared/stores/app.store';
import { useScreenOrientation } from '@vueuse/core';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const { mdAndDown, mdAndUp, lgAndUp } = useDisplay();
const videoId = route.params.id as string;

const loading = ref(true);
const videoInfo = ref<Tables<'videos'>>();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const showInfo = ref(false);
const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation();

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

watch(lgAndUp, (isTrue) => {
    console.log(isTrue);
    isTrue ? appStore.showHeader() : appStore.hideHeader();
});

function seekToChapter(seconds: number) {
    playerRef.value.videoRef.currentTime = seconds;
    playerRef.value.videoRef.play();
}

const chapters = ref([
    {
        start_s: 1510,
        title: 'Just Chatting',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/509658-100x133.jpg',
    },
    {
        start_s: 1800,
        title: 'Mario Kart World',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/1826300051_IGDB-100x133.jpg',
    },
    {
        start_s: 2400,
        title: 'Call of Duty: Black II',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/489401_IGDB-100x133.jpg',
    },
    {
        start_s: 8720,
        title: 'SilkSong',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/511391_IGDB-100x133.jpg',
    },
]);

onMounted(async () => {
    console.log('go');
    lockOrientation('landscape').catch((err) => {
        console.warn('Could not lock orientation:', err);
    });
    console.log('fdsfkldfak');
    if (lgAndUp.value) {
        appStore.showHeader();
    } else {
        appStore.hideHeader();
    }
    // await new Promise((resolve) => setTimeout(resolve, 1200));
    await getVideoInfo();
    loading.value = false;

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

const getVideoInfo = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(videoId)).single();
    if (error) return console.error('Error fetching videos:', error);

    videoInfo.value = data;
    TitleHelper.setTitle(data.title);
};

const updateVideoTime = (e: any | any) => {
    if (!e || !e.target.currentTime) return;
    videoTime.value = Math.floor(e.target.currentTime);
};
</script>

<template>
    <div v-if="videoInfo" class="h-available overflow-hidden flex flex-col md:flex-row">
        <div class="md:overflow-auto lg:p-4 lg:pr-0">
            <div class="h-full lg:h-auto lg:bg-red-200">
                <Player
                    :options="options"
                    @timeupdate="updateVideoTime"
                    ref="playerRef"
                    :stretchHeight="!lgAndUp"
                    class="lg:rounded-md overflow-hidden"
                >
                    <source :src="`http://localhost:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                </Player>
            </div>

            <InfoDesktop
                v-if="mdAndUp"
                :videoInfo="videoInfo"
                :chapters="chapters"
                @clickChapter="seekToChapter($event.start_s)"
            />
        </div>

        <div class="relative overflow-hidden grow-1 md:w-[220px] md:shrink-0 lg:w-[320px] xl:w-[360px]">
            <Info
                :showInfo="showInfo"
                :videoInfo="videoInfo"
                :chapters="chapters"
                @clickChapter="seekToChapter($event.start_s)"
            />
            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div>
    </div>
</template>
