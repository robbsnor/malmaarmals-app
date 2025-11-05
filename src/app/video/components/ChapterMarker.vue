<script setup lang="ts">
import { computed } from 'vue';
import { useVideoStore } from '../stores/video.store';
import type { ChapterWithCategory } from '../models/chapters-with-category.model';

const props = withDefaults(
    defineProps<{
        chapter: ChapterWithCategory;
    }>(),
    {}
);

const videoStore = useVideoStore();

const offsetLeft = computed(() => {
    if (!videoStore.duration) return;
    if (props.chapter.category.title.toLowerCase() === 'beginning') return;

    const percentage = (100 / videoStore.duration) * props.chapter.start_s;
    if (percentage <= 0) return;

    return percentage + '%';
});
</script>

<template>
    <v-tooltip :text="chapter.category.title" location="top" :open-delay="0">
        <template v-slot:activator="{ props }">
            <div
                v-if="offsetLeft"
                v-bind="props"
                class="size-5 flex justify-center items-center absolute cursor-pointer left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                :style="{ left: offsetLeft }"
                @click="videoStore.currentTime = chapter.start_s"
            >
                <div class="h-1 w-1 bg-white rounded-full"></div>
            </div>
        </template>
    </v-tooltip>
</template>
