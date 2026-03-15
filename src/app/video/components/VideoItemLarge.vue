<script setup lang="ts">
import { computed } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { formatTimeAgo } from '@vueuse/core';
import type { Video } from '../models/video.model';
import type { Playlist } from '../../playlists/models/playlist.model';
import VideoItemOptions from './VideoItemOptions.vue';
import { useDisplay } from 'vuetify/lib/composables/display.mjs';

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

const { lgAndUp } = useDisplay();

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <div v-if="lgAndUp">
        <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }">
            <VideoThumbnail
                :to="{ name: 'video', params: { id: props.video.video_id } }"
                :src="BucketHelper.getThumbnailUrl(props.video.video_id)"
                :videoId="props.video.video_id"
                :durationS="props.video.length_sec"
            >
            </VideoThumbnail>
        </RouterLink>

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

            <VideoItemOptions class="shrink-0 -mr-2" v-if="props.showOptions" :video="video" :playlist="playlist" />
        </div>
    </div>
</template>
