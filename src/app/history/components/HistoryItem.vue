<script setup lang="ts">
import { computed } from 'vue';
import VideoThumbnail from '../../video/components/VideoThumbnail.vue';
import type { HistoryVideo } from '../models/history-video.model';

const props = withDefaults(
    defineProps<{
        video: HistoryVideo;
    }>(),
    {}
);

const categories = computed(() => {
    const cats = props.video.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail :video="video" class="w-36 shrink-0" />

        <div>
            <h2 class="font-bold text-md line-clamp-2 leading-snug">
                {{ props.video.title }}
            </h2>
            <div v-if="props.video.chapters.length" class="text-muted text-sm font-medium line-clamp-2">
                {{ categories.join(', ') }}
            </div>
            <!-- <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(video.watched_at)) }}
            </div> -->
        </div>
    </RouterLink>
</template>
