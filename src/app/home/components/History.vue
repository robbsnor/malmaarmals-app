<script setup lang="ts">
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import VideoItem from '../../video/components/VideoItem.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { computed } from 'vue';
import { useHistoryStore } from '../../video/stores/history.store';

const videosStore = useVideosStore();
const historyStore = useHistoryStore();
const videos = computed(() => historyStore.videos.slice(0, 5));
</script>

<template>
    <Section v-if="videos.length" title="History" moreLink="/history" moreText="view all">
        <div class="flex flex-col gap-4">
            <VideoItem v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
