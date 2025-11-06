<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';
import CategoryThumbnail from './CategoryThumbnail.vue';

const sheet = defineModel<boolean>();
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

function skipToSec(sec: number) {
    videoStore.currentTime = sec;

    videoStore.playing = true;
    videoStore.showControllsAndInfo = true;
    sheet.value = false;
}
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

        <div class="flex flex-col gap-2">
            <button
                v-for="chapter in videoStore.chapters"
                :key="chapter.start_s"
                @click="skipToSec(chapter.start_s)"
                class="flex items-center gap-4 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
            >
                <CategoryThumbnail :category="chapter.category" />

                <div class="overflow-hidden">
                    <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                    <div class="text-muted text-sm">{{ prettyTime(chapter.start_s) }}</div>
                </div>
                <v-icon class="ml-auto" color="var(--color-text-muted)">mdi-chevron-right</v-icon>
            </button>
        </div>
    </Drawer>
</template>
