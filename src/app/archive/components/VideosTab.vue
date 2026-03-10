<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import VideoItem from '../../video/components/VideoItem.vue';
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
</script>

<template>
    <div class="pt-4">
        <FilterIndicator archiveType="STREAMS" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" v-auto-animate>
            <template
                v-for="video in videosStore.filteredVideos.slice(0, archiveStore.amountToShow)"
                :key="video.video_id"
            >
                <VideoItem class="lg:hidden" :video="video" />
                <VideoItemLarge class="max-lg:hidden" :video="video" />
            </template>
        </div>

        <!-- nothing found -->
        <Empty
            v-if="archiveStore.query && !videosStore.filteredVideos.length"
            :title="`No video's found...`"
            icon="mdi-magnify"
            description="Try something else."
        >
            <!-- <v-btn @click="archiveStore.resetQuery">Clear</v-btn> -->
        </Empty>

        <div v-if="archiveStore.amountToShow < videosStore.filteredVideos.length" class="flex justify-center mt-8">
            <v-btn :rounded="true" variant="tonal" color="primary" @click="archiveStore.amountToShow += 100">
                Load More
            </v-btn>
        </div>
    </div>
</template>
