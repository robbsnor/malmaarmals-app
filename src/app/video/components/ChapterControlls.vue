<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <div class="flex justify-between items-center gap-4 bg-black-400 border border-black-700 rounded-md px-4 py-3">
        <div class="text-muted">{{ videoStore.prettyCurrentTime }}</div>

        <div class="flex justify-center items-center gap-3">
            <!-- <v-btn
                icon="mdi-rewind-5"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime - 5"
            /> -->
            <!-- <v-btn
                icon="mdi-rewind-10"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime - 10"
            /> -->

            <button class="rounded bg-black-700 px-2 py-1" @click="videoStore.rate = 1">1x</button>
            <button class="rounded bg-black-700 px-2 py-1" @click="videoStore.rate = 3">3x</button>
            <button class="rounded bg-black-700 px-2 py-1" @click="videoStore.rate = 5">5x</button>
            <button class="rounded bg-black-700 px-2 py-1" @click="videoStore.currentTime = videoStore.currentTime - 5">
                -5s
            </button>
            <button
                class="rounded bg-black-700 px-2 py-1"
                @click="videoStore.currentTime = videoStore.currentTime - 60"
            >
                -1m
            </button>
            <v-btn
                v-if="!videoStore.waiting"
                :icon="videoStore.playing ? 'mdi-pause' : 'mdi-play'"
                variant="tonal"
                size="x-small"
                @click="videoStore.playing = !videoStore.playing"
            />
            <div v-else class="size-[32px] flex justify-center items-center">
                <v-progress-circular size="x-small" width="2" indeterminate />
            </div>

            <button
                class="rounded bg-black-700 px-2 py-1"
                @click="videoStore.currentTime = videoStore.currentTime + 1 * 60"
            >
                +1m
            </button>
            <button
                class="rounded bg-black-700 px-2 py-1"
                @click="videoStore.currentTime = videoStore.currentTime + 5 * 60"
            >
                +5m
            </button>
            <!--
            <v-btn
                icon="mdi-fast-forward-10"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime + 10"
            /> -->
            <!-- <v-btn
                icon="mdi-fast-forward-5"
                variant="tonal"
                size="x-small"
                @click="videoStore.currentTime = videoStore.currentTime + 5"
            /> -->
        </div>
    </div>
</template>
