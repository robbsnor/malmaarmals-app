<script setup lang="ts">
import { computed, ref } from 'vue';
import VideoItem from './components/VideoItem.vue';
import VideoItemLarge from './components/VideoItemLarge.vue';
import { useVideosStore } from './stores/videos.store';
import { useArchiveStore } from '../archive/stores/archive.store';
import FilterIndicator from '../archive/components/FilterIndicator.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

TitleHelper.setTitle('streams');

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();

const amountToShow = ref(50);
const lekkerSpeurenUrl = computed(
    () => `https://www.lekkerspeuren.nl/?filter=type%3Dvideo%26search%3D${archiveStore.query}`
);
</script>

<template>
    <Section title="Streams">
        <FilterIndicator archiveType="STREAMS" />

        <div class="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" v-auto-animate>
            <template v-for="video in videosStore.filteredVideos.slice(0, amountToShow)" :key="video.video_id">
                <VideoItem :video="video" />
                <VideoItemLarge :video="video" />
            </template>
        </div>

        <!-- nothing found -->
        <Empty
            v-if="archiveStore.query && !videosStore.filteredVideos.length"
            :title="`No video's found...`"
            icon="mdi-magnify"
            description="Try something else, or check lekkerspeuren.nl"
        >
            <v-btn
                :href="lekkerSpeurenUrl"
                variant="tonal"
                color="primary"
                target="_blank"
                append-icon="mdi-open-in-new"
            >
                lekkerspeuren.nl
            </v-btn>
            <!-- <v-btn @click="archiveStore.resetQuery">Clear</v-btn> -->
        </Empty>

        <div v-if="amountToShow < videosStore.filteredVideos.length" class="flex justify-center mt-8">
            <v-btn :rounded="true" variant="tonal" color="primary" @click="amountToShow += 100"> Load More </v-btn>
        </div>
    </Section>
</template>
