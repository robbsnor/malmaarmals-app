<script setup lang="ts">
import { breakpoints } from '../../shared/helpers/breakpoints.helper';
import VideoItem from '../../videos/components/VideoItem.vue';
import VideoItemLarge from '../../videos/components/VideoItemLarge.vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();

const amount = computed(() => {
    if (breakpoints.greaterOrEqual('2xl').value) return 10;
    if (breakpoints.greaterOrEqual('xl').value) return 8;
    if (breakpoints.greaterOrEqual('md').value) return 6;
    return 5;
});
</script>

<template>
    <Section title="Recent streams" :more-link="{ name: 'streams' }" moreText="All Streams">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.videos.length }} streams</div>
        </template>

        <template v-if="videosStore.videos.length">
            <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <template v-for="video in videosStore.videos.slice(0, amount)" :key="video.video_id">
                    <VideoItem v-if="!breakpoints.greaterOrEqual('md').value" :video="video" />
                    <VideoItemLarge v-else :video="video" />
                </template>
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
