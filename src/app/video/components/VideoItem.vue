<script setup lang="ts">
import { computed } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { TimeHelper } from '../../shared/helpers/time.helper';
import type { VideoWithChapters } from '../models/videos-with-chapters';

const props = withDefaults(
    defineProps<{
        video: VideoWithChapters;
    }>(),
    {}
);

const categories = computed(() => props.video?.chapters.map((chapter) => chapter.category.title));
const daysAgo = computed(() => {
    const recordedAt = new Date(props.video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail
            class="w-36 shrink-0"
            :src="BucketHelper.getThumbnailUrl(props.video.video_id)"
            :durationS="props.video.length_sec"
        />

        <div>
            <h2 class="font-bold text-md line-clamp-2 leading-snug">
                {{ props.video.title }}
            </h2>
            <div v-if="props.video?.chapters.length" class="text-muted text-sm font-medium line-clamp-2">
                {{ categories.join(', ') }}
            </div>
            <div class="text-muted-more text-sm font-medium">{{ daysAgo }} days ago</div>
        </div>
    </RouterLink>
</template>
