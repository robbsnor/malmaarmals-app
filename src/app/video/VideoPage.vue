<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';
import Player from '../shared/components/Player.vue';

const route = useRoute();
const videoId = route.params.id as string;

const loading = ref(true);
const videoInfo = ref();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const videoNotFound = ref(false);
const open = ref(false);

const options = computed(() => ({
    markers: {
        enabled: true,
        points: chapters.value.map((chapter) => ({
            time: chapter.start_s,
            label: chapter.title,
        })),
    },
}));

function seekToChapter(seconds: number) {
    playerRef.value.videoRef.currentTime = seconds;
    playerRef.value.videoRef.play();
}

const chapters = ref([
    {
        start_s: 1510,
        title: 'Q&A',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/493388_IGDB-100x133.jpg',
    },
    {
        start_s: 2700,
        title: 'Conclusion',
        image_url: 'https://static-cdn.jtvnw.net/ttv-boxart/493388_IGDB-100x133.jpg',
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
    <div v-if="videoInfo" class="h-available flex flex-col">
        <div>
            <div class="bg-red-200">
                <div class="aspect-video">
                    <Player :options="options" @timeupdate="updateVideoTime" ref="playerRef">
                        <source :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                    </Player>
                </div>
            </div>

            <div class="bg-green-200 rounded-md p-4 hidden">
                <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                <h3 class="text-text-muted font-bold">
                    {{ videoInfo.description }}
                </h3>
                <h3 class="text-text-muted">{{ date }}</h3>
            </div>
        </div>

        <div>
            <template>
                <v-card>
                    <v-tabs v-model="tab" bg-color="primary">
                        <v-tab value="one">Item One</v-tab>
                        <v-tab value="two">Item Two</v-tab>
                        <v-tab value="three">Item Three</v-tab>
                    </v-tabs>

                    <v-card-text>
                        <v-tabs-window v-model="tab">
                            <v-tabs-window-item value="one"> One </v-tabs-window-item>

                            <v-tabs-window-item value="two"> Two </v-tabs-window-item>

                            <v-tabs-window-item value="three"> Three </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card-text>
                </v-card>
            </template>
        </div>
        <Chat :videoId="Number(videoId)" :videoTime="videoTime" />

        <!-- <div class="overflow-auto scrollbar-invisible rounded-md">
            <div class="aspect-video mx-auto" style="max-height: calc(100% - 0.4rem * 12)">
                <Player :options="options" @timeupdate="updateVideoTime" ref="playerRef">
                    <source :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                </Player>
            </div>

            <div class="p-4">
                <div class="flex justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                        <h3 class="text-text-muted font-bold">
                            {{ videoInfo.description }}
                        </h3>
                        <h3 class="text-text-muted">{{ date }}</h3>
                    </div>

                    <v-menu :location-strategy="{}">
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" v-bind="props"> Activator slot </v-btn>
                        </template>

                        <div class="p-4 bg-black-250">
                            <div v-for="chapter in chapters" :key="chapter.start_s">
                                <h4 class="text-lg font-bold">{{ chapter.title }}</h4>
                                <img :src="chapter.image_url" alt="" class="w-50 rounded-md" />
                            </div>
                        </div>
                    </v-menu>
                </div>
            </div>
        </div> -->
    </div>
</template>
