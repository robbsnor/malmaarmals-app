<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import VideoLarge from '../../shared/components/VideoLarge.vue';
import Video from '../../shared/components/Video.vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const videos = computed(() => videosStore.videos.slice(0, 5));
</script>

<template>
    <Section title="Previous Streams" moreLink="/videos">
        <!-- <div class="hidden md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <VideoLarge v-for="video in videosStore.videos" :key="video.video_id" :video="video" />
        </div> -->

        <div class="flex flex-col gap-4">
            <Video v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
