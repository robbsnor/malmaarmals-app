<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, useTemplateRef } from 'vue';
import Video from '../shared/components/Video.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../video/stores/videos.store';

TitleHelper.setTitle('videos');

const videosStore = useVideosStore();
const { filteredVideos } = storeToRefs(videosStore);
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

const amountToShow = ref(100);
</script>

<template>
    <Section title="Previous Streams" :show-top-stroke="false" v-if="filteredVideos">
        <div class="flex justify-center flex-col gap-8 items-center pb-8 md:hidden">
            <v-text-field
                ref="searchRef"
                v-model="videosStore.query"
                :rounded="true"
                placeholder="Search..."
                :density="'compact'"
                autofocus
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full"
            />
        </div>

        <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <Video v-for="video in filteredVideos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
