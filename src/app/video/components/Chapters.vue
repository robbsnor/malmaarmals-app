<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useManageChaptersStore } from '../stores/manage-chapters.store';
import { prettyTime } from '../../shared/helpers/prettyTime';
import CategoryThumbnail from './CategoryThumbnail.vue';

const videoStore = useVideoStore();
const manageChaptersStore = useManageChaptersStore();

function skipToSec(sec: number) {
    videoStore.setTimePrior(sec);

    videoStore.playing = true;
    videoStore.showControllsAndInfo = true;
    manageChaptersStore.showDrawer = false;
}
</script>

<template>
    <button
        v-for="chapter in videoStore.chapters"
        :key="chapter.start_s"
        @click="skipToSec(chapter.start_s)"
        class="flex items-center gap-4 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
    >
        <CategoryThumbnail :category="chapter.category" />

        <div class="overflow-hidden">
            <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
            <div class="text-muted text-sm">
                {{ prettyTime(videoStore.getTimePrior(chapter.start_s)) }}
            </div>
        </div>
        <v-icon class="ml-auto" color="var(--color-text-muted)">mdi-chevron-right</v-icon>
    </button>
</template>
