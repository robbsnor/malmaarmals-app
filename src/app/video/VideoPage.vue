<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';

const route = useRoute();
const videoId = route.params.id as string;

const loading = ref(true);
const videoInfo = ref();
const videoRef = ref<HTMLVideoElement>();
const videoTime = ref(0);
const videoNotFound = ref(false);

const options = {
    markers: {
        enabled: true,
        points: [
            { time: 100, label: 'foo' },
            { time: 200, label: 'buz' },
            { time: 300, label: 'bar' },
            { time: 2000, label: 'abaa' },
        ],
    },
};

onMounted(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
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

const getVideoInfo = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(videoId)).single();
    if (error) return console.error('Error fetching videos:', error);

    videoInfo.value = data;
};

const updateVideoTime = () => {
    if (!videoRef.value) return;
    videoTime.value = Math.floor(videoRef.value.currentTime);
};

const onTimeChange = () => {
    updateVideoTime();
};
</script>

<template>
    <div v-if="!loading">
        <div
            v-if="!videoNotFound"
            class="h-available 4xl:grid-cols-[1fr_600px] grid grid-flow-col grid-cols-[1fr_300px] gap-4 overflow-hidden bg-amber-100f p-4"
        >
            <div class="scrollbar-invisible overflow-auto rounded-md bg-red-300f">
                <template v-if="videoInfo">
                    <div class="relative flex-1 rounded-md bg-blue-300">
                        <Player :src="`http://192.168.2.41:8000/videos/${videoInfo.video_id}`" :options="options" />
                    </div>

                    <div class="mt-4 rounded-md bg-pink-500f bg-neutral-900a p-4">
                        <h2 class="text-2xl font-bold">{{ videoInfo.title }}</h2>
                        <h3 class="text-text-muted font-bold">
                            {{ videoInfo.description }}
                        </h3>
                        <h3 class="text-text-muted">{{ date }}</h3>
                    </div>
                </template>
            </div>

            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div>
    </div>

    <div v-else class="h-available 4xl:grid-cols-[1fr_600px] grid grid-flow-col grid-cols-[1fr_300px] gap-4 p-4">
        <div class="flex flex-col gap-4">
            <USkeleton class="rounded-md flex-1" />
            <USkeleton class="rounded-md h-20" />
        </div>
        <USkeleton class="rounded-md" />
    </div>
</template>
