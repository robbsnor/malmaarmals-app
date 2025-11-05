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
        <!-- <div class="hidden md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <VideoItemLarge v-for="video in videosStore.videos" :key="video.video_id" :video="video" />
        </div> -->

        <div class="flex flex-col gap-4">
            <VideoItem v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
