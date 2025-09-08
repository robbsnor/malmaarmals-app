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
    await new Promise((resolve) => setTimeout(resolve, 8000));
    chapters.value.pop();
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
    <div class="h-available md:flex gap-4 p-4">
        <template v-if="videoInfo">
            <div class="grow overflow-auto scrollbar-invisible">
                <div class="aspect-video mx-auto" style="max-height: calc(100% - 0.4rem * 12)">
                    <Player :options="options" @timeupdate="updateVideoTime" ref="playerRef">
                        <source :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                    </Player>
                </div>

                <div class="p-4 flex justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                        <h3 class="text-text-muted font-bold">
                            {{ videoInfo.description }}
                        </h3>
                        <h3 class="text-text-muted">{{ date }}</h3>
                    </div>

                    <div>
                        <UPopover v-model:open="open" :content="{ avoidCollisions: true, side: 'top', align: 'end' }">
                            <template #anchor>
                                <UButton label="Chapters" trailing-icon="i-lucide-chevron-down" @click="open = !open" />
                            </template>

                            <template #content>
                                <div class="p-2 flex flex-col gap-1">
                                    <button
                                        @click="
                                            seekToChapter(chapter.start_s);
                                            open = false;
                                        "
                                        v-for="chapter in chapters"
                                        class="flex gap-2 p-2 pr-2 items-center text-left cursor-pointer hover:bg-black-400 rounded-md"
                                    >
                                        <img :src="chapter.image_url" alt="" class="w-8 rounded-sm" />
                                        <div>
                                            <div>{{ chapter.title }}</div>
                                            <div class="text-xs text-text-muted">
                                                {{ formatSeconds(chapter.start_s) }}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>

            <div class="md:w-[300px] shrink-0">
                <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
            </div>
        </template>
    </div>

    <!-- <div
            v-if="!loading"
            class="4xl:grid-cols-[1fr_600px] grid grid-flow-col grid-cols-[1fr_300px] gap-4 overflow-hidden p-4"
        >
            <div class="scrollbar-invisible overflow-auto rounded-md bg-red-300f">
                <template v-if="videoInfo">
                    <div class="relative flex-1 rounded-md bg-blue-300">
                        <Player :options="options" @timeupdate="updateVideoTime">
                            <source :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                        </Player>
                    </div>

                    <div class="mt-4 rounded-md bg-pink-500f bg-red-200 p-4">
                        <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                        <h3 class="text-text-muted font-bold">
                            {{ videoInfo.description }}
                        </h3>
                        <h3 class="text-text-muted">{{ date }}</h3>
                    </div>
                </template>
            </div>

            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div> -->

    <!-- <div v-else class="h-available 4xl:grid-cols-[1fr_600px] grid grid-flow-col grid-cols-[1fr_300px] gap-4 p-4">
        <div class="flex flex-col gap-4">
            <USkeleton class="rounded-md flex-1" />
            <USkeleton class="rounded-md h-20" />
        </div>
        <USkeleton class="rounded-md" />
    </div> -->
</template>
