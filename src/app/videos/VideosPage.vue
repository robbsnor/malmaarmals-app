<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, useTemplateRef } from 'vue';
import Video from '../shared/components/VideoLarge.vue';
import VideoSmall from '../shared/components/Video.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from './stores/videos.store';
import { useDisplay } from 'vuetify';

TitleHelper.setTitle('videos');

const videosStore = useVideosStore();
const { filteredVideos } = storeToRefs(videosStore);
const { smAndUp, mdAndUp, lgAndUp } = useDisplay();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

const amountToShow = ref(100);
</script>

<template>
    <Section title="Streams" v-if="filteredVideos">
        <template #actions v-if="videosStore.videos.length"> {{ videosStore.videos.length }} </template>

        <div class="flex justify-center flex-col gap-4 items-center pb-4">
            <v-text-field
                ref="searchRef"
                v-model="videosStore.query"
                :rounded="true"
                placeholder="Search..."
                density="comfortable"
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full"
            />
        </div>

        <div class="grid grid-cols gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <template v-for="video in filteredVideos.slice(0, amountToShow)">
                <Video v-if="smAndUp" :key="video.video_id" :video="video" />
                <VideoSmall v-else :key="`${video.video_id}_small`" :video="video" />
            </template>
        </div>

        <div v-if="amountToShow < filteredVideos.length" class="flex justify-center mt-8">
            <v-btn :rounded="true" :elevation="0" variant="outlined" @click="amountToShow += 200"> Load More </v-btn>
        </div>
    </Section>
</template>
