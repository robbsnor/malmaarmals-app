<script setup lang="ts">
import { computed } from 'vue';
import { formatTimeAgo } from '@vueuse/core';
import type { Video } from '../models/video.model';
import type { Playlist } from '../../playlists/models/playlist.model';
import VideoItemOptions from './VideoItemOptions.vue';
import VideoThumbnail from './VideoThumbnail.vue';
import { DateHelper } from '../../shared/helpers/date.helper.ts';

const props = withDefaults(
    defineProps<{
        video: Video;
        playlist?: Playlist;
        showOptions?: boolean;
        showTimeAgo?: boolean;
    }>(),
    {
        showOptions: true,
        showTimeAgo: true,
        responsive: true,
    }
);

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});

const date = computed(() => {
    return new Date(props.video.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const isLongerThanAYearAgo = computed(() => {
    const recordedDate = new Date(props.video.recorded_at);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setMonth(oneYearAgo.getMonth() + 1);
    return recordedDate < oneYearAgo;
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
                <div v-if="props.showTimeAgo" class="text-muted-more text-md font-medium">
                    <template v-if="isLongerThanAYearAgo">
                        {{ date }}
                    </template>
                    <template v-else>
                        {{ formatTimeAgo(new Date(props.video.recorded_at)) }}
                    </template>
                </div>
            </div>

            <div class="shrink-0 -mr-2">
                <VideoItemOptions v-if="props.showOptions" :video="video" :playlist="playlist" />
            </div>
        </div>
    </div>
</template>
