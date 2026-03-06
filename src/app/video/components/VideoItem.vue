<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';
import { formatTimeAgo } from '@vueuse/core';

const props = withDefaults(
    defineProps<{
        video: VideoWithChapters;
    }>(),
    {}
);

const slots = useSlots();

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail
            class="w-36 shrink-0"
            :src="BucketHelper.getThumbnailUrl(props.video.video_id)"
            :videoId="props.video.video_id"
            :durationS="props.video.length_sec"
        />

        <div>
            <h2 class="font-bold text-md line-clamp-2 leading-snug">
                {{ props.video.title }}
            </h2>
            <div v-if="props.video?.chapters.length" class="text-muted text-sm font-medium line-clamp-1">
                {{ categories.join(', ') }}
            </div>
            <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(props.video.recorded_at)) }}
            </div>
        </div>

        <div v-if="slots.actions" class="ml-auto tits relative z-10">
            <slot name="actions"></slot>
        </div>
    </RouterLink>
</template>
