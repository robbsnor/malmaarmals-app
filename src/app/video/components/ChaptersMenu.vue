<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';

const props = withDefaults(
    defineProps<{
        size?: 'big' | 'small';
    }>(),
    {
        size: 'big',
    }
);

const videoStore = useVideoStore();

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
    <v-menu location="top right">
        <template v-slot:activator="{ props }">
            <v-icon v-if="size === 'small'" v-bind="props" size="28">mdi-format-list-bulleted</v-icon>

            <v-btn
                v-if="size === 'big'"
                variant="tonal"
                color="primary"
                text-color="red"
                v-bind="props"
                prepend-icon="mdi-format-list-bulleted"
            >
                Chapters
            </v-btn>
        </template>

        <div class="flex flex-col gap-2 bg-black-200 border border-black-400 h-100 rounded-xl overflow-auto p-2">
            <button
                v-for="chapter in videoStore.chapters"
                :key="chapter.start_s"
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
</template>
