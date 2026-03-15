<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Video } from '../models/video.model';
import type { VideoProgression } from '../../video/models/video-progression.model';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

const props = withDefaults(
    defineProps<{
        video: Video;
    }>(),
    {}
);

const duration = computed(() => TimeHelper.formatTime(props.video.length_sec));

// const time = computed(() => {
//     return JSON.parse(localStorage.getItem(props.videoId?.toString())) as VideoProgression;
// });
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="relative">
        <Thumbnail :src="BucketHelper.getThumbnailUrl(props.video.video_id)" />

        <!-- <div
            v-if="time && time.percentage < 95 && time.percentage > 5"
            class="absolute bottom-0 right-0 left-0 h-1 z-1 bg-black/50"
        >
            <div class="bg-primary h-full" :style="{ width: `${time.percentage}%` }"></div>
        </div> -->

        <div class="absolute bottom-2 right-2 bg-black/50 rounded-md text-xs px-1.5 py-0.5">
            {{ duration }}
        </div>
    </RouterLink>
</template>
