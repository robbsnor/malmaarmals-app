<script setup lang="ts">
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import VideoItem from '../../video/components/VideoItem.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const videos = computed(() => videosStore.videos.slice(80, 85));
</script>

<template>
    <Section title="History" moreLink="/history" moreText="view all">
        <div class="flex flex-col gap-4">
            <VideoItem v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
