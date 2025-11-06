<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <div class="flex justify-between items-center gap-4 bg-black-400 border border-black-700 rounded-md px-4 py-3">
        <div class="text-muted">{{ videoStore.prettyCurrentTime }}</div>

        <div class="flex justify-center items-center gap-3">
            <v-btn
                icon="mdi-rewind-5"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime - 5"
            />
            <v-btn
                icon="mdi-rewind-10"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime - 10"
            />

            <v-btn
                v-if="!videoStore.waiting"
                :icon="videoStore.playing ? 'mdi-pause' : 'mdi-play'"
                variant="tonal"
                size="x-small"
                @click="videoStore.playing = !videoStore.playing"
            />
            <div v-else class="size-[32px] flex justify-center items-center">
                <v-progress-circular size="x-small" width="3" indeterminate></v-progress-circular>
            </div>

            <v-btn
                icon="mdi-fast-forward-10"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime + 10"
            />
            <v-btn
                icon="mdi-fast-forward-5"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime + 5"
            />
        </div>
    </div>
</template>
