<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef, watch } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { useDisplay } from 'vuetify';

const route = useRoute();
const { mdAndDown, mdAndUp } = useDisplay();
const videoId = route.params.id as string;

const loading = ref(true);
const videoInfo = ref();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const videoNotFound = ref(false);
const open = ref(false);
const tab = ref('chat');

const options = computed(() => ({
    controls: playerDefaultOptions.controls.filter((item: any) => !['pip', 'volume', 'mute'].includes(item)),
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
};

const updateVideoTime = (e: any) => {
    videoTime.value = Math.floor(e.target.currentTime);
};
</script>

<template>
    <div v-if="videoInfo" class="h-available flex flex-col md:flex-row">
        <Player :options="options" @timeupdate="updateVideoTime" ref="playerRef">
            <source :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
        </Player>

        <div class="flex-1 overflow-hidden md:shrink-0 md:basis-[300px]">
            <v-tabs v-if="!mdAndUp" color="red" grow density="compact" v-model="tab" bg-color="#202020">
                <v-tab value="chat">Chat</v-tab>
                <v-tab value="info">Info</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab" class="h-full">
                <v-tabs-window-item value="chat" class="h-full">
                    <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
                </v-tabs-window-item>

                <v-tabs-window-item value="info">
                    <div class="p-4">
                        <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                        <h3 class="text-text-muted font-bold">
                            {{ videoInfo.description }}
                        </h3>
                        <h3 class="text-text-muted">{{ date }}</h3>
                    </div>

                    <div class="flex flex-col gap-4 p-4 border-t border-black-700">
                        <a
                            class="flex items-center gap-4"
                            v-for="chapter in chapters"
                            @click="seekToChapter(chapter.start_s)"
                        >
                            <img :src="chapter.image_url" alt="Chapter Image" class="w-10" />
                            <div>
                                <h4 class="font-bold truncate">{{ chapter.title }}</h4>
                                <div class="text-sm text-text-muted">{{ formatSeconds(chapter.start_s) }}</div>
                            </div>
                        </a>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </div>
    </div>
</template>
