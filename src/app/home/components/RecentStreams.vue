<script setup lang="ts">
import VideoItem from '../../video/components/VideoItem.vue';
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import { useVideosStore } from '../../video/stores/videos.store';

const videosStore = useVideosStore();
</script>

<template>
    <Section title="Recent streams" moreLink="/archive?type=streams" moreText="All Streams">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.videos.length }} streams</div>
        </template>

        <template v-if="videosStore.videos.length">
            <div class="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <template v-for="(video, index) in videosStore.videos.slice(0, 10)" :key="video.video_id">
                    <VideoItem :class="[index >= 6 ? 'hidden' : '']" c :video="video" />
                    <VideoItemLarge :video="video" />
                </template>
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
