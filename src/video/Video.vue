<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../supabase';
import { useRoute } from 'vue-router';

const route = useRoute();
const videoId = route.params.id;

const videoInfo = ref();
const messages = ref<any[]>([]);
const videoRef = ref<HTMLVideoElement>();
const croppedMessages = ref<any[]>([]);
const currentTime = ref(0);

onMounted(async () => {
    console.log('Mounted Video Page');
    console.log(route);
    getVideoInfo();
    getMessages();
});

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

const getMessages = async () => {
    let from = 0;
    let to = 999;
    let hasMore = true;

    while (hasMore) {
        const { data, error, count } = await supabase
            .from('messages')
            .select('user_name,user_color,text,offset_sec,id', {
                count: 'exact',
            })
            .eq('video_id', videoId)
            .order('date', { ascending: true })
            .range(from, to);

        console.log(count);

        if (error) {
            return console.error('Error fetching messages:', error);
        }

        if (data && data.length > 0) {
            messages.value = [...messages.value, ...data];
            from += 1000;
            to += 1000;
            hasMore = data.length === 1000;
        } else {
            hasMore = false;
        }
    }
};

const updateCurrentTime = () => {
    if (!videoRef.value) return;
    currentTime.value = Math.floor(videoRef.value.currentTime);
};

const onTimeChange = () => {
    updateCurrentTime();

    croppedMessages.value = messages.value.filter(
        (message) => message.offset_sec >= currentTime.value - 200 && message.offset_sec <= currentTime.value
    );
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
                    <video
                        style="max-height: calc(100vh - var(--header-height) - (var(--spacing) * 4 * 2))"
                        muted
                        autoplay
                        ref="videoRef"
                        controls
                        :src="`http://localhost:8000/videos/${videoInfo.video_id}`"
                        class="aspect-video w-full rounded-md"
                        @timeupdate="onTimeChange()"
                    ></video>
                </div>

                <div class="mt-4 rounded-md bg-pink-500f bg-neutral-900a p-4">
                    <h2 class="text-2xl font-bold">{{ videoInfo.title }} | {{ currentTime }}s</h2>
                    <h3 class="text-text-muted font-bold">
                        {{ videoInfo.description }}
                    </h3>
                    <h3 class="text-text-muted font-bold">{{ date }}</h3>
                    {{ messages ? messages.length : 0 }}
                </div>
            </template>
        </div>

        <div
            v-if="messages"
            class="flex h-full flex-col-reverse overflow-y-auto rounded-md bg-pink-500a bg-neutral-900a p-2"
        >
            <ul class="flex flex-col gap-[3px] rounded-md">
                <li v-for="message in croppedMessages" :key="message.id">
                    <span
                        :style="{
                            color: message.user_color ? message.user_color : '#2e8b57',
                        }"
                        class="font-bold"
                    >
                        ({{ message.offset_sec }}s)
                        {{ message.user_name }}
                    </span>
                    <span class="break-words text-gray-300"> : {{ message.text }} </span>
                </li>
            </ul>
        </div>
    </div>
</template>
