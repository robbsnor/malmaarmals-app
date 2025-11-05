<script setup lang="ts">
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import VideoItem from '../../video/components/VideoItem.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const videos = computed(() => videosStore.videos.slice(0, 5));
</script>

<template>
    <Section title="Streams" moreLink="/archive?type=streams" moreText="All Streams">
        <div v-if="videosStore.videos.length" class="flex flex-col gap-4">
            <VideoItem v-for="video in videos" :key="video.video_id" :video="video" />
        </div>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
