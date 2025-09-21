<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Video from '../shared/components/Video.vue';
import { useAppStore } from '../shared/stores/app.store';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import Container from '../shared/components/Container.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideoStore } from '../video/stores/videos.store';

TitleHelper.setTitle('videos');

const appStore = useAppStore();
const videoStore = useVideoStore();
const { filteredVideos } = storeToRefs(videoStore);
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

const amountToShow = ref(100);
const lessVideos = computed(() => filteredVideos?.value.slice(0, amountToShow.value));
const loadMore = () => {
    amountToShow.value += 9999;
};

onMounted(() => {});
</script>

<template>
    <Section :show-top-stroke="false" v-if="filteredVideos">
        <div class="flex justify-center flex-col gap-8 items-center pb-20 md:hidden">
            <v-text-field
                ref="searchRef"
                v-model="videoStore.query"
                :rounded="true"
                placeholder="Search..."
                :density="'compact'"
                autofocus
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full max-w-120"
            />
        </div>

        <div class="grid grid-cols-5 gap-8">
            <Video v-for="video in lessVideos" :key="video.video_id" :video="video" />
        </div>

        <v-btn v-if="filteredVideos.length > amountToShow" @click="loadMore">Load More</v-btn>
    </Section>
</template>
