<script setup lang="ts">
import { computed } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import type { History } from '../models/history.model';

const props = withDefaults(
    defineProps<{
        history: History;
    }>(),
    {}
);

const categories = computed(() => {
    const cats = props.history.video.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.history.video.video_id } }" class="flex gap-4">
        <VideoThumbnail
            class="w-36 shrink-0"
            :src="BucketHelper.getThumbnailUrl(history.video.video_id)"
            :videoId="history.video.video_id"
            :durationS="history.video.length_sec"
        />

        <div>
            <h2 class="font-bold text-md line-clamp-2 leading-snug">
                {{ props.history.video.title }}
            </h2>
            <div v-if="props.history.video.chapters.length" class="text-muted text-sm font-medium line-clamp-2">
                {{ categories.join(', ') }}
            </div>
            <!-- <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(video.watched_at)) }}
            </div> -->
        </div>
    </RouterLink>
</template>
