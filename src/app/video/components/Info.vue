<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/types/database.types';

const props = withDefaults(
    defineProps<{
        videoInfo: Tables<'videos'>;
        showInfo: boolean;
        chapters: {
            start_s: number;
            title: string;
            image_url: string;
        }[];
    }>(),
    {}
);

const date = computed(() => {
    return new Date(props.videoInfo.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
const prettyTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(hrs);
    parts.push(hrs > 0 ? String(mins).padStart(2, '0') : mins);
    parts.push(String(secs).padStart(2, '0'));

    return parts.join(':');
};
</script>

<template>
    <div
        class="invisible -translate-y-2 transition-all opacity-0 absolute top-0 left-0 right-0 md:hidden shadow-2xl bg-black-300 border-b border-black-400"
        :class="{ 'visible translate-y-0 opacity-100': props.showInfo }"
    >
        <div class="pb-4 p-4">
            <div class="font-bold text-lg">{{ videoInfo.title }}</div>
            <div class="text-muted">{{ date }}</div>
        </div>

        <div class="flex gap-4 overflow-auto flex-nowrap p-4 bg-black-200">
            <button
                v-for="chapter in chapters"
                :key="chapter.start_s"
                @click="$emit('seekToChapter', chapter)"
                class="flex min-w-[300px] gap-2 p-3 bg-black-400 rounded-md shrink-0 cursor-pointer text-left transition-all hover:bg-black-500"
            >
                <img :src="chapter.image_url" alt="chapter image" class="inline h-12 mr-2 rounded-md" />
                <div>
                    <div class="font-bold pr-2">{{ chapter.title }}</div>
                    <div class="text-muted text-sm">{{ prettyTime(chapter.start_s) }}</div>
                </div>
            </button>
        </div>
    </div>
</template>
