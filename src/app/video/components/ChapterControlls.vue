<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <div class="flex justify-between items-center gap-4 bg-black-150 rounded-md px-4 py-3 mb-4">
        <div>{{ videoStore.prettyCurrentTime }}</div>

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
                :icon="videoStore.playing ? 'mdi-pause' : 'mdi-play'"
                variant="tonal"
                size="x-small"
                @click="videoStore.playing = !videoStore.playing"
            />

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
