<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';
import { RouterLink, useRouter } from 'vue-router';
import MiniPlayerButton from './MiniPlayerButton.vue';

const videoStore = useVideoStore();
const router = useRouter();

function maximizePlayer() {
    router.push({ name: 'video', params: { id: videoStore.videoId } });
}

function togglePlay() {
    videoStore.playing = !videoStore.playing;
}

function close() {
    videoStore.reset();
    videoStore.player.isActive = false;
}
</script>

<template>
    <button
        v-if="videoStore.player.isMini"
        class="absolute inset-0 flex justify-between items-start p-2"
        @click.self="maximizePlayer"
    >
        <MiniPlayerButton v-if="videoStore.waiting">
            <v-progress-circular v-if="videoStore.waiting" class="relative" indeterminate size="24" width="2" />
        </MiniPlayerButton>

        <MiniPlayerButton v-else @click="togglePlay">
            <v-icon
                size="24"
                :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
            />
        </MiniPlayerButton>

        <MiniPlayerButton @click="close">
            <v-icon size="24" icon="mdi-close" />
        </MiniPlayerButton>
    </button>
</template>
