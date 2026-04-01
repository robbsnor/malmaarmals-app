<script setup lang="ts">
import { computed } from 'vue';
import type { Video } from '../models/video.model';
import { formatTimeAgo } from '@vueuse/core';
import VideoItemOptions from './VideoItemOptions.vue';
import type { Playlist } from '../../playlists/models/playlist.model';
import VideoThumbnail from './VideoThumbnail.vue';

const props = withDefaults(
    defineProps<{
        video: Video;
        playlist?: Playlist;
        showOptions?: boolean;
    }>(),
    {
        showOptions: true,
        responsive: true,
    }
);

const categories = computed(() => {
    const cats = props.video.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <RouterLink :to="{ name: 'stream', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail :video="props.video" class="w-36 shrink-0" />

        <div class="flex-1 min-w-0">
            <h2 class="font-bold text-md line-clamp-2 leading-snug break-words">
                {{ props.video.title }}
            </h2>
            <div v-if="props.video.chapters.length" class="text-muted text-sm font-medium line-clamp-1">
                {{ categories.join(', ') }}
            </div>
            <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(props.video.recorded_at)) }}
            </div>
        </div>

        <VideoItemOptions v-if="props.showOptions" :video="video" :playlist="playlist" />
    </RouterLink>
</template>
