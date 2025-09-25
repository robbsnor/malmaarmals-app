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
</script>

<template>
    <div
        class="invisible -translate-y-4 duration-200 ease-linear transition-all opacity-0 absolute top-0 left-0 right-0 bg-black-300 bordder border-b border-black-400 md:hidden"
        :class="{ 'visible  translate-y-0 opacity-100': props.showInfo }"
    >
        <div class="pb-4 p-4">
            <div class="font-bold text-lg">{{ videoInfo.title }}</div>
            <div class="text-text-muted">{{ date }}</div>
        </div>

        <div class="flex gap-4 overflow-auto flex-nowrap p-4 bg-black-200">
            <button
                v-for="chapter in chapters"
                :key="chapter.start_s"
                @click="$emit('seekToChapter', chapter)"
                class="flex min-w-7/12 gap-2 p-3 bg-black-400 rounded-md shrink-0 cursor-pointer text-left transition-all hover:bg-black-500"
            >
                <img :src="chapter.image_url" alt="chapter image" class="inline h-12 mr-2 rounded-md" />
                <div>
                    <div class="font-bold pr-2">{{ chapter.title }}</div>
                    <div class="text-text-muted text-sm">{{ chapter.start_s }}</div>
                </div>
            </button>
        </div>
    </div>
</template>
