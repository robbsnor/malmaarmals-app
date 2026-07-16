<script setup lang="ts">
import { computed } from 'vue';
import VideoThumbnail from '../../videos/components/VideoThumbnail.vue';
import type { HistoryVideo } from '../models/history-video.model';
import { VideoHelper } from '../../videos/helpers/video.helper.ts';

const props = withDefaults(
    defineProps<{
        video: HistoryVideo;
    }>(),
    {}
);

const categories = computed(() => VideoHelper.getUniqueCategories(props.video.chapters));
</script>

<template>
    <RouterLink :to="{ name: 'stream', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail :video="video" class="w-36 shrink-0" />

        <div>
            <h2 class="font-bold text-md line-clamp-2 leading-snug break-words">
                {{ props.video.title }}
            </h2>
            <div v-if="categories.length" class="text-muted text-sm font-medium line-clamp-2">
                {{ categories.join(', ') }}
            </div>
            <!-- <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(video.watched_at)) }}
            </div> -->
        </div>
    </RouterLink>
</template>
