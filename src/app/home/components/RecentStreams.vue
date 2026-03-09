<script setup lang="ts">
import VideoItem from '../../video/components/VideoItem.vue';
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
</script>

<template>
    <Section title="Recent streams" moreLink="/archive?type=streams" moreText="All Streams">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.videos.length }} streams</div>
        </template>

        <template v-if="videosStore.videos.length">
            <div class="flex flex-col gap-5 lg:hidden">
                <VideoItem v-for="video in videosStore.videos.slice(0, 5)" :key="video.video_id" :video="video" />
            </div>

            <div class="grid gap-x-4 gap-y-8 grid-cols-5 xl:gap-8 max-lg:hidden">
                <VideoItemLarge v-for="video in videosStore.videos.slice(0, 10)" :key="video.video_id" :video="video" />
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
