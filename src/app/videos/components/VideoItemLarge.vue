<script setup lang="ts">
import { computed } from 'vue';
import { formatTimeAgo } from '@vueuse/core';
import type { Video } from '../models/video.model';
import type { Playlist } from '../../playlists/models/playlist.model';
import VideoItemOptions from './VideoItemOptions.vue';
import VideoThumbnail from './VideoThumbnail.vue';

const props = withDefaults(
    defineProps<{
        video: Video;
        playlist?: Playlist;
        showOptions?: boolean;
    }>(),
    {
        showOptions: true,
    }
);

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <div>
        <VideoThumbnail :video="props.video" />

        <div class="flex">
            <div class="grow">
                <h2 class="font-bold text-lg pt-2 line-clamp-2 leading-tight">
                    {{ props.video.title }}
                </h2>
                <div v-if="props.video?.chapters.length" class="text-muted text-md font-medium line-clamp-2">
                    {{ categories.join(', ') }}
                </div>
                <div class="text-muted-more text-md font-medium">
                    {{ formatTimeAgo(new Date(props.video.recorded_at)) }}
                </div>
            </div>

            <div class="shrink-0 -mr-2">
                <VideoItemOptions v-if="props.showOptions" :video="video" :playlist="playlist" />
            </div>
        </div>
    </div>
</template>
