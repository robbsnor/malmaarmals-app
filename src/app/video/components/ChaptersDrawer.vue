<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';

const sheet = defineModel<boolean>();
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
    <Drawer v-model="sheet" inset title="Chapters">
        <template #activator="{ props }">
            <PlayerButton
                v-if="videoStore.chapters?.length"
                v-bind="props"
                icon="mdi-format-list-bulleted"
                :size="24"
            />
        </template>

        <div class="flex flex-col gap-2 max-h-100 overflow-auto">
            <button
                v-for="chapter in videoStore.chapters"
                :key="chapter.start_s"
                @click="
                    videoStore.currentTime = chapter.start_s;
                    sheet = false;
                "
                class="flex gap-2 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
            >
                <img :src="chapter.category.image_url" alt="chapter image" class="inline h-10 mr-2 rounded-md" />
                <div class="overflow-hidden">
                    <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                    <div class="text-muted text-sm leading-3">{{ prettyTime(chapter.start_s) }}</div>
                </div>
            </button>
        </div>
    </Drawer>
</template>
