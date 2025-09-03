<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        video: any;
        isFirst?: boolean;
    }>(),
    {
        isFirst: false,
    }
);

const daysAgo = computed(() => {
    const recordedAt = new Date(props.video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const formattedDuration = computed(() => {
    const duration = props.video.length_sec;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    if (hours > 0) {
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
</script>

<template>
    <div class="relative transition-all duration-200 rounded-md">
        <RouterLink :to="`/videos/${props.video.video_id}`" class="relative transition-all duration-200 group">
            <img
                :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                alt=""
                class="relative mb-2 aspect-video w-full rounded-md"
            />
            <div class="absolute right-2 bottom-2 bg-bg-normal leading-none p-1.5 text-text-muted text-sm rounded-md">
                {{ formattedDuration }}
            </div>
            <div
                class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-all duration-200 flex justify-center items-center"
            >
                <UIcon name="i-lucide-play" class="size-8" />
            </div>
        </RouterLink>

        <div class="pt-1">
            <h2 class="font-bold text-md">
                {{ props.video.title }}
            </h2>
            <p class="text-text-muted text-sm font-medium">Super Mario Kart World</p>
            <p class="text-text-muted text-sm font-medium">{{ daysAgo }} days ago</p>
        </div>
    </div>
</template>
