<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Video from '../shared/components/Video.vue';
import { useAppStore } from '../shared/stores/app.store';
import { computed, ref } from 'vue';

const appStore = useAppStore();
const { filteredVideos } = storeToRefs(appStore);

const amountToShow = ref(200);
const lessVideos = computed(() => filteredVideos?.value.slice(0, amountToShow.value));
const loadMore = () => {
    amountToShow.value += 200;
};
</script>

<template>
    <Container v-if="filteredVideos">
        <div class="grid grid-cols-5 items-center gap-8">
            <Video v-for="video in lessVideos" :key="video.video_id" :video="video" />
        </div>

        <v-btn v-if="filteredVideos.length > amountToShow" @click="loadMore">Load More</v-btn>
    </Container>
</template>
