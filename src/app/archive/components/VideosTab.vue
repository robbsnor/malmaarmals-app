<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import VideoItem from '../../video/components/VideoItem.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const amountToShow = ref(100);
</script>

<template>
    <FilterIndicator archiveType="STREAMS" />

    <div class="grid grid-cols gap-4">
        <VideoItem
            v-for="video in videosStore.filteredVideos.slice(0, amountToShow)"
            :key="video.video_id"
            :video="video"
        />
    </div>

    <!-- nothing found -->
    <Empty
        v-if="archiveStore.query && !videosStore.filteredVideos.length"
        :title="`No video's found: '${archiveStore.query}'`"
        icon="mdi-magnify"
        description="Try something else."
    >
        <v-btn @click="archiveStore.resetQuery">Clear</v-btn>
    </Empty>

    <div v-if="amountToShow < videosStore.filteredVideos.length" class="flex justify-center mt-8">
        <v-btn :rounded="true" variant="tonal" color="primary" @click="amountToShow += 500"> Load More </v-btn>
    </div>
</template>
