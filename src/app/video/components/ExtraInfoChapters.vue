<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import CategoryThumbnail from './CategoryThumbnail.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <ExtraInfoItem v-if="videoStore.chapters.length" title="Chapters">
        <div v-if="videoStore.chapters?.length" class="flex flex-col gap-2 p-4">
            <button
                v-for="chapter in videoStore.chapters"
                :key="chapter.start_s"
                class="flex items-center gap-4 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
            >
                <CategoryThumbnail :category="chapter.category" />

                <div class="overflow-hidden">
                    <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                    <div class="text-muted text-sm"></div>
                </div>
                <v-icon class="ml-auto" color="var(--color-text-muted)">mdi-chevron-right</v-icon>
            </button>
        </div>

        <Empty v-else title="No chapters yet..." icon="mdi-format-list-bulleted"> </Empty>
    </ExtraInfoItem>
</template>
