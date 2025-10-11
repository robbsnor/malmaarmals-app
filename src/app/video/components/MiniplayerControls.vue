<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';

const videoStore = useVideoStore();
const appStore = useAppStore();
</script>

<template>
    <div class="absolute inset-0 flex flex-col opacity-0 hover:opacity-100 transition-opacity h-full">
        <div class="absolute inset-0 bg-black/50"></div>

        <RouterLink
            :to="`/videos/${videoStore.videoId}`"
            class="relative flex items-center justify-between gap-4 p-2 bg-black-100/50 text-normal"
        >
            <div v-if="videoStore.videoInfo" class="truncate">{{ videoStore.videoInfo.title }}</div>
            <v-btn icon variant="plain" size="x-small" @click="appStore.player.isActive = false">
                <v-icon icon="mdi-close" size="20" />
            </v-btn>
        </RouterLink>

        <div class="flex justify-center items-center gap-4 grow p-2">
            <v-btn icon variant="plain" @click="videoStore.playing = !videoStore.playing">
                <v-icon
                    size="20"
                    :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
                />
            </v-btn>
            <v-btn icon size="x-small" variant="plain" :to="`/videos/${videoStore.videoId}`">
                <v-icon size="20" icon="mdi-open-in-new" />
            </v-btn>
        </div>
    </div>
</template>
