<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from './stores/video.store';
import { useAuthStore } from '../auth/stores/auth.store';
import VideoNotAllowed from './components/VideoNotAllowed.vue';
import { useHistoryStore } from '../history/stores/history.store';
import { TitleHelper } from '../shared/helpers/title.helper';
import { usePreferenceStore } from '../shared/stores/preference.store.ts';

const route = useRoute();
const videoStore = useVideoStore();
const authStore = useAuthStore();
const preferenceStore = usePreferenceStore();
const historyStore = useHistoryStore();

onMounted(async () => {
    await init();
});

async function init() {
    videoStore.playerIsActive = true;
    videoStore.playerIsMini = false;

    const videoId = Number(route.params.id);
    const playlistId = route.query.playlistId as string;

    const isSameVideoId = videoId === videoStore.id;
    const isSamePlaylistId = playlistId === videoStore.playlistId;
    if (isSameVideoId && isSamePlaylistId) return;
    if (!authStore.isSubbed) return;

    if (preferenceStore.autoFullscreen) videoStore.enterFullscreen();
    if (preferenceStore.autoTheatre) videoStore.theaterMode = true;

    await videoStore.init(videoId, playlistId);
    TitleHelper.setTitle(videoStore.info.title);
}

watch(route, async () => {
    await init();
});

onUnmounted(() => {
    videoStore.playerIsMini = true;
});
</script>

<template>
    <VideoNotAllowed />
</template>
