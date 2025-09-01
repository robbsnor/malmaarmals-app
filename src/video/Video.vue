<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';

const route = useRoute();
const videoId = route.params.id as string;

const videoInfo = ref();
const videoRef = ref<HTMLVideoElement>();
const videoTime = ref(0);

onMounted(async () => {
    await getVideoInfo();
});

const videoOptions = {
    controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'settings',
        'pip',
        'airplay',
        'fullscreen',
    ],
    volume: 0.75,
    autoplay: true,
};

const date = computed(() => {
    return new Date(videoInfo.value.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const getVideoInfo = async () => {
    const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('video_id', videoId)
        .single();

    if (videoError) return console.error('Error fetching videos:', videoError);

    videoInfo.value = videoData;
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
    <div
        class="4xl:grid-cols-[1fr_600px] grid grid-flow-col grid-cols-[1fr_300px] gap-4 overflow-hidden bg-amber-100f p-4"
        style="height: calc(100vh - var(--header-height)); margin-top: var(--header-height)"
    >
        <div class="scrollbar-invisible overflow-auto rounded-md bg-red-300f">
            <template v-if="videoInfo">
                <div class="relative flex-1 rounded-md bg-blue-300">
                    <VuePlyr :options="videoOptions">
                        <video
                            style="max-height: calc(100vh - var(--header-height) - (var(--spacing) * 4 * 2))"
                            ref="videoRef"
                            class="aspect-video w-full rounded-md"
                            @timeupdate="onTimeChange()"
                        >
                            <source :src="`http://localhost:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                        </video>
                    </VuePlyr>
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

        <Chat :videoId="videoId" :videoTime="videoTime" />
    </div>
</template>
