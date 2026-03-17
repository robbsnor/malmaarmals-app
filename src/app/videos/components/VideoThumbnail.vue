<script setup lang="ts">
import { computed } from 'vue';
import type { Video } from '../models/video.model';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useHistoryStore } from '../../history/stores/history.store';

const props = withDefaults(
    defineProps<{
        video: Video;
    }>(),
    {}
);

const historyStore = useHistoryStore();
const history = computed(() => historyStore.history.find((v) => v.video_id === props.video.id));
const progressionPercentage = computed(() => {
    const videoTime = Number(history.value?.video_time ?? 0);
    if (!videoTime) return 0;

    return (100 / props.video.length_sec) * videoTime;
});
const duration = computed(() => TimeHelper.formatTime(props.video.length_sec));
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="relative">
        <Thumbnail :src="BucketHelper.getThumbnailUrl(props.video.video_id)">
            <div v-if="progressionPercentage" class="absolute bottom-0 right-0 left-0 h-1 z-1 bg-white/30">
                <div class="bg-primary h-full" :style="{ width: `clamp(10%, ${progressionPercentage}%, 100%)` }"></div>
            </div>

            <div class="absolute bottom-2 right-2 bg-black/50 rounded-md text-xs px-1.5 py-0.5">
                {{ duration }}
            </div>
        </Thumbnail>
    </RouterLink>
</template>
