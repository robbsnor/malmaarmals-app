<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef, watch } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { useDisplay } from 'vuetify';
import { TitleHelper } from '../shared/helpers/title.helper';
import type { Tables } from '../shared/types/database.types';

TitleHelper.setTitle('video');

const route = useRoute();
const { mdAndDown, mdAndUp } = useDisplay();
const videoId = route.params.id as string;

const loading = ref(true);
const videoInfo = ref<Tables<'videos'>>();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const videoNotFound = ref(false);
const showInfo = ref(false);
const open = ref(false);
const tab = ref('chat');

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

watch(mdAndUp, (newVal) => (tab.value = 'chat'));

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
        start_s: 2700,
        title: 'SilkSong',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/511391_IGDB-100x133.jpg',
    },
]);

onMounted(async () => {
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

const date = computed(() => {
    return new Date(videoInfo.value.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

function formatSeconds(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(hrs);
    parts.push(hrs > 0 ? String(mins).padStart(2, '0') : mins);
    parts.push(String(secs).padStart(2, '0'));

    return parts.join(':');
}

const getVideoInfo = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(videoId)).single();
    if (error) return console.error('Error fetching videos:', error);

    videoInfo.value = data;
    TitleHelper.setTitle(data.title);
};

const updateVideoTime = (e: any) => {
    videoTime.value = Math.floor(e.target.currentTime);
};
</script>

<template>
    <div v-if="videoInfo" class="h-available flex flex-col md:flex-row">
        <Player :options="options" @timeupdate="updateVideoTime" ref="playerRef">
            <source :src="`http://localhost:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
        </Player>

        <div class="relative flex-1 overflow-hidden md:shrink-0 md:basis-[320px]">
            <div
                class="invisible -translate-y-4 duration-500 transition-all opacity-0 absolute top-0 left-0 right-0 bg-black-300 bordder border-b border-black-400"
                :class="{ 'visible  translate-y-0 opacity-100': showInfo }"
            >
                <div class="pb-4 p-4">
                    <div class="font-bold text-lg">{{ videoInfo.title }}</div>
                    <div class="text-text-muted">{{ date }}</div>
                </div>

                <div class="flex gap-4 overflow-auto flex-nowrap p-4 bg-black-200">
                    <button
                        v-for="chapter in chapters"
                        :key="chapter.start_s"
                        @click="seekToChapter(chapter.start_s)"
                        class="flex min-w-7/12 gap-2 p-3 bg-black-400 rounded-md shrink-0 cursor-pointer text-left transition-all hover:bg-black-600"
                    >
                        <img :src="chapter.image_url" alt="chapter image" class="inline h-12 mr-2 rounded-md" />
                        <div>
                            <div class="font-bold pr-2">{{ chapter.title }}</div>
                            <div class="text-text-muted text-sm">{{ chapter.start_s }}</div>
                        </div>
                    </button>
                </div>
            </div>

            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div>
    </div>
</template>
