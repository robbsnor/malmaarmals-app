<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store.ts';
import { breakpoints } from '../../shared/helpers/breakpoints.helper';
import VideoItem from '../../videos/components/VideoItem.vue';
import VideoItemLarge from '../../videos/components/VideoItemLarge.vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const authStore = useAuthStore();

const amount = computed(() => {
    if (breakpoints.greaterOrEqual('2xl').value) return 10;
    if (breakpoints.greaterOrEqual('xl').value) return 8;
    if (breakpoints.greaterOrEqual('md').value) return 6;
    return 5;
});
</script>

<template>
    <Section title="What others are watching" v-if="videosStore.whatOthersWatch.length">
        <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <template v-for="video in videosStore.whatOthersWatch.slice(0, amount)" :key="video.video_id">
                <VideoItem v-if="!breakpoints.greaterOrEqual('md').value" :video="video" :show-time-ago="false" />
                <VideoItemLarge v-else :video="video" :show-time-ago="false" />
            </template>
        </div>
    </Section>
</template>
