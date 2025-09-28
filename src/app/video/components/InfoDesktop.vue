<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/types/database.types';

const props = withDefaults(
    defineProps<{
        videoInfo: Tables<'videos'>;
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
    <div class="hidden md:block overflow-hidden rounded-md">
        <div class="flex justify-between items-center gap-4 pb-4 p-4">
            <div class="">
                <div class="font-bold text-lg">{{ videoInfo.title }}</div>
                <div class="text-muted">{{ date }}</div>
            </div>

            <v-menu location="top right">
                <template v-slot:activator="{ props }">
                    <v-btn
                        variant="tonal"
                        color="primary"
                        text-color="red"
                        v-bind="props"
                        prepend-icon="mdi-format-list-bulleted"
                        >chapters</v-btn
                    >
                </template>

                <div
                    class="flex flex-col gap-2 bg-black-200 border border-black-400 h-100 rounded-md overflow-auto p-2"
                >
                    <button
                        v-for="chapter in chapters"
                        :key="chapter.start_s"
                        @click="$emit('seekToChapter', chapter)"
                        class="flex w-[300px] gap-2 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 cursor-pointer text-left transition-all hover:bg-black-400"
                    >
                        <img :src="chapter.image_url" alt="chapter image" class="inline h-10 mr-2 rounded-md" />
                        <div class="overflow-hidden">
                            <div class="font-bold pr-2 truncate">{{ chapter.title }}</div>
                            <div class="text-muted text-sm leading-3">{{ prettyTime(chapter.start_s) }}</div>
                        </div>
                    </button>
                </div>
            </v-menu>
        </div>
        <Stroke />

        <!-- <div class="flex gap-4 overflow-auto p-4">
            <button
                v-for="chapter in chapters"
                :key="chapter.start_s"
                @click="$emit('seekToChapter', chapter)"
                class="flex min-w-[300px] gap-2 p-3 border border-black-500 rounded-md shrink-0 cursor-pointer text-left transition-all hover:bg-black-300"
            >
                <img :src="chapter.image_url" alt="chapter image" class="inline h-12 mr-2 rounded-md" />
                <div>
                    <div class="font-bold pr-2">{{ chapter.title }}</div>
                    <div class="text-muted text-sm">{{ prettyTime(chapter.start_s) }}</div>
                </div>
            </button>
        </div> -->
    </div>
</template>
