<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';
import { RouterLink, useRouter } from 'vue-router';
import VideoButton from './VideoButton.vue';

const videoStore = useVideoStore();
const router = useRouter();

function maximizePlayer() {
    router.push({ name: 'video', params: { id: videoStore.videoId } });
}

function togglePlay() {
    videoStore.playing = !videoStore.playing;
}
</script>

<template>
    <button
        v-if="videoStore.player.isMini"
        class="absolute inset-0 flex justify-between items-start p-2"
        @click.self="maximizePlayer"
    >
        <VideoButton @click="togglePlay">
            <v-icon
                size="24"
                :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
            />
        </VideoButton>

        <VideoButton @click="videoStore.reset">
            <v-icon size="24" icon="mdi-close" />
        </VideoButton>
    </button>
</template>
