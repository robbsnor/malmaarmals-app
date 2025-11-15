<script setup lang="ts">
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/video/components/VideoContainer.vue';
import MainDrawer from './app/layout/components/MainDrawer.vue';
import { useVideosStore } from './app/video/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted, ref } from 'vue';
import { useAuthStore } from './app/auth/stores/auth.store';
import { sleep } from './app/shared/helpers/sleep';
import { useHistoryStore } from './app/video/stores/history.store';
import Offline from './app/layout/components/Offline.vue';

const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
const historyStore = useHistoryStore();
const loading = ref(true);
const hasError = ref(false);

onMounted(async () => {
    loading.value = true;

    setTimeout(() => {
        if (loading.value) {
            console.log('failsafe');
            loading.value = false;
            hasError.value = true;
        }
    }, 20_000);

    await authStore.mirrorSession();

    await Promise.all([
        authStore.updateIsSubscribed(),
        videosStore.fetchVideos(),
        playlistsStore.fetchPlaylists(),
        historyStore.fetchHistory(),
    ]).catch(async (err) => {
        await sleep(800);
        hasError.value = true;
    });

    loading.value = false;
});
</script>

<template>
    <v-app v-if="!loading && !hasError">
        <div class="pb-[var(--height-mobile-navbar)]">
            <RouterView />
        </div>

        <BottomNav />
        <VideoContainer />
        <MainDrawer />
    </v-app>

    <Offline :loading="loading" :hasError="hasError" />
</template>
