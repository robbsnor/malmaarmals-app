<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';
import { RouterLink } from 'vue-router';

const videoStore = useVideoStore();
const appStore = useAppStore();
</script>

<template>
    <RouterLink
        :to="`/videos/${videoStore.videoId}`"
        v-if="appStore.player.isMini"
        @click="appStore.player.isMini = false"
        class="absolute inset-0 flex justify-between p-2"
    >
        <v-btn icon variant="tonal" @click.stop="videoStore.playing = !videoStore.playing">
            <v-icon
                size="20"
                :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
            />
        </v-btn>

        <v-btn icon variant="tonal" @click="appStore.player.isActive = false">
            <v-icon icon="mdi-close" size="20" />
        </v-btn>
    </RouterLink>
</template>
