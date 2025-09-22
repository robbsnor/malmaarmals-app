<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Video from '../shared/components/Video.vue';
import { useAppStore } from '../shared/stores/app.store';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import Container from '../shared/components/Container.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../video/stores/videos.store';

TitleHelper.setTitle('videos');

const videosStore = useVideosStore();
const { filteredVideos } = storeToRefs(videosStore);
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

const amountToShow = ref(100);
const lessVideos = computed(() => filteredVideos?.value.slice(0, amountToShow.value));
const showAll = () => (amountToShow.value = filteredVideos.value.length);
</script>

<template>
    <Section :show-top-stroke="false" v-if="filteredVideos">
        <div class="flex justify-center flex-col gap-8 items-center pb-20 md:hidden">
            <v-text-field
                ref="searchRef"
                v-model="videosStore.query"
                :rounded="true"
                placeholder="Search..."
                :density="'compact'"
                autofocus
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full max-w-120"
            />
        </div>

        <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <Video v-for="video in lessVideos" :key="video.video_id" :video="video" />
        </div>

        <div class="flex justify-center pt-12">
            <v-btn v-if="filteredVideos.length > amountToShow" @click="showAll" color="primary">Show all</v-btn>
        </div>
    </Section>
</template>
