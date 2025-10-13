<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import VideoItemLarge from '../../videos/components/VideoItemLarge.vue';
import VideoItem from '../../videos/components/VideoItem.vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const videos = computed(() => videosStore.videos.slice(0, 5));
</script>

<template>
    <Section title="Streams" moreLink="/videos" moreText="All Streams">
        <!-- <div class="hidden md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <VideoItemLarge v-for="video in videosStore.videos" :key="video.video_id" :video="video" />
        </div> -->

        <div class="flex flex-col gap-4">
            <VideoItem v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
