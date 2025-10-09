<script setup lang="ts">
import { computed } from 'vue';
import { BucketHelper } from '../helpers/bucket.helper';

const props = withDefaults(
    defineProps<{
        video: any;
        isFirst?: boolean;
    }>(),
    {
        isFirst: false,
    }
);

const daysAgo = computed(() => {
    const recordedAt = new Date(props.video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const formattedDuration = computed(() => {
    const duration = props.video.length_sec;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    if (hours > 0) {
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
</script>

<template>
    <div class="flex gap-4">
        <VideoThumbnail
            class="w-30 shrink-0"
            :to="`/videos/${props.video.video_id}`"
            :src="BucketHelper.getThumbnailUrl(props.video.video_id)"
        >
        </VideoThumbnail>

        <div>
            <h2 class="font-bold text-md wrap-anywhere">
                {{ props.video.title }}
            </h2>
            <p class="text-muted text-sm font-medium">Super Mario Kart World</p>
            <p class="text-muted-more text-sm font-medium">{{ daysAgo }} days ago</p>
        </div>
    </div>
</template>
