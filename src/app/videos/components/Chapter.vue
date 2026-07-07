<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Chapter } from '../models/chapter.model';
import CategoryThumbnail from './CategoryThumbnail.vue';
import { TIME_PRIOR_OFFSET_S, useVideoStore } from '../stores/video.store';
import { prettyTime } from '../../shared/helpers/prettyTime.ts';

const props = withDefaults(
    defineProps<{
        chapter: Chapter;
    }>(),
    {}
);

const videoStore = useVideoStore();

const currentTime = computed(() => videoStore.currentTimeRounded + TIME_PRIOR_OFFSET_S);
// @ts-ignore
const isLastChapter = computed(() => props.chapter.id === videoStore.chapters.at(-1).id);
const isOldChapter = computed(() => currentTime.value >= props.chapter.end_s);
const isActiveChapter = computed(
    () => currentTime.value >= props.chapter.start_s && currentTime.value < props.chapter.end_s
);
const isLastBit = computed(() => currentTime.value > videoStore.video.length_sec - 60 * 3);

const percentage = computed(() => {
    if (isOldChapter.value) return 100;
    if (!isActiveChapter.value) return 0;

    const offset = currentTime.value - props.chapter.start_s;
    const duration = props.chapter.end_s - props.chapter.start_s;
    return Math.round((offset / duration) * 100);
});
</script>

<template>
    <div class="flex gap-2 cursor-pointer" @click="videoStore.setTimePrior(props.chapter.start_s)">
        <div class="flex flex-col items-center">
            <div
                class="flex justify-center items-center size-4 rounded-full border-3 relative border-black-500"
                :class="{
                    'border-primary!': isActiveChapter || isOldChapter,
                }"
            >
                <div
                    class="size-1 rounded-full"
                    :class="{
                        'bg-primary-light': isActiveChapter,
                    }"
                ></div>
            </div>

            <div
                class="w-[3px] grow -mt-0.5 bg-black-500 rounded-full"
                :class="{
                    'bg-primary-darker!': isOldChapter,
                }"
            >
                <div class="w-full bg-primary rounded-full" :style="{ height: `${percentage}%` }"></div>
            </div>

            <div
                v-if="isLastChapter"
                class="w-3 h-1 mb-3 -mt-[3px] bg-black-500 rounded-full"
                :class="{ 'bg-primary!': isLastBit }"
            ></div>
        </div>

        <div
            class="flex gap-4 mb-3 mt-1 hover:bg-black-40f0 grow transition-all hover:opacity-100!"
            :class="{ 'opacity-40': !isActiveChapter }"
        >
            <CategoryThumbnail :category="props.chapter.category" />

            <div class="overflow-hidden">
                <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                <div class="text-muted text-sm">
                    {{ prettyTime(videoStore.getTimePrior(chapter.start_s)) }}
                </div>
            </div>
        </div>
    </div>
</template>
