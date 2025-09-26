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
    <div>
        <VideoThumbnail
            :to="`/videos/${props.video.video_id}`"
            :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
        >
            <div
                class="absolute right-2 bottom-2 bg-black/20 leading-none py-1.5 px-2 backdrop-blur-2xl text-normal text-sm rounded-md"
            >
                {{ formattedDuration }}
            </div>
        </VideoThumbnail>

        <h2 class="font-bold text-md pt-2">
            {{ props.video.title }}
        </h2>
        <p class="text-muted text-sm font-medium">Super Mario Kart World</p>
        <p class="text-muted-more text-sm font-medium">{{ daysAgo }} days ago</p>

        <!-- <template v-if="video.categories.length">
            <div
                v-for="category in video.categories"
                :key="category.id"
                class="mt-2 flex items-center gap-2"
            >
                <img
                    :src="category.image_url"
                    alt=""
                    class="rounded-md"
                />

                <span class="text-sm text-gray-500">
                    {{ category.title }}
                </span>
            </div>
        </template> -->
    </div>
</template>
