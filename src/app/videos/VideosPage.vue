<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Video from '../shared/components/Video.vue';
import { useAppStore } from '../shared/stores/app.store';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import Container from '../shared/components/Container.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

TitleHelper.setTitle('videos');

const appStore = useAppStore();
const { filteredVideos } = storeToRefs(appStore);
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

const amountToShow = ref(200);
const lessVideos = computed(() => filteredVideos?.value.slice(0, amountToShow.value));
const loadMore = () => {
    amountToShow.value += 200;
};

onMounted(() => {
    searchRef.value?.focus();
});
</script>

<template>
    <Section :show-top-stroke="false" v-if="filteredVideos">
        <div class="flex justify-center flex-col gap-8 items-center pb-20 md:hidden">
            <GradientText text="Search Videos" />
            <v-text-field
                ref="searchRef"
                v-model="appStore.query"
                class="w-100"
                hide-details
                append-inner-icon="mdi-magnify"
                placeholder="Search..."
            ></v-text-field>
        </div>

        <div class="grid grid-cols-5 gap-8">
            <Video v-for="video in lessVideos" :key="video.video_id" :video="video" />
        </div>

        <v-btn v-if="filteredVideos.length > amountToShow" @click="loadMore">Load More</v-btn>
    </Section>
</template>
