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
    <div class="hidden md:block overflow-hidden rounded-md">
        <div class="flex justify-between items-center gap-4 pb-4 p-4">
            <div class="">
                <div class="font-bold text-lg">{{ videoStore.videoInfo.title }}</div>
                <div class="text-muted">{{ date }} {{ videoStore.videoId }}</div>
                <div class="text-muted-more">{{ videoStore.subCount }} subs</div>
                <div class="text-muted-more">{{ videoStore.messages.length }} messages</div>
            </div>

            <ChaptersMenu />
        </div>
    </div>
</template>
