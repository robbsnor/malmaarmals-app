<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/types/database.types';
import { useVideoStore } from '../stores/video.store';
import ChaptersMenu from './ChaptersMenu.vue';

const videoStore = useVideoStore();

const date = computed(() => {
    return new Date(videoStore.videoInfo.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
</script>

<template>
    <div v-if="!videoStore.player.isMini" class="hidden md:block overflow-hidden">
        <div class="flex justify-between items-start gap-8 p-4 bg-black-200 rounded-t-md">
            <div class=" ">
                <div class="font-bold text-lg">{{ videoStore.videoInfo.title }}</div>
                <div class="text-muted">{{ date }}</div>
                <div class="text-muted-more">
                    {{ videoStore.messages.length }} messages, {{ videoStore.subCount }} subs
                </div>
            </div>

            <ChaptersMenu />
        </div>
    </div>
</template>
