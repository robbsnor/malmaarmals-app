<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { formatTimeAgo } from '@vueuse/core';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';

const props = withDefaults(
    defineProps<{
        video: VideoWithChapters;
        isFirst?: boolean;
    }>(),
    {
        isFirst: false,
    }
);

const slots = useSlots();

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <div>
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
            <div>
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

            <div v-if="slots.actions" class="ml-auto tits relative z-10">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>
