<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/videos/components/VideoContainer.vue';
import MainDrawer from './app/layout/components/MainDrawer.vue';
import { useAppStore } from './app/shared/stores/app.store';
import { useVideosStore } from './app/videos/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted } from 'vue';
import { sleep } from './app/shared/helpers/sleep';

const appStore = useAppStore();
const videosStore = useVideosStore();
const playlistsStore = usePlaylistsStore();

onMounted(async () => {
    appStore.loading = true;
    await Promise.all([videosStore.fetchVideos(), playlistsStore.fetchPlaylists()]);
    appStore.loading = false;
});
</script>

<template>
    <v-app>
        <div v-visible="appStore.loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <v-progress-circular indeterminate size="64" color="primary" />
        </div>

        <div class="fpb-(--height-mobile-navbar) pb-[80px]">
            <RouterView />
        </div>

        <VideoContainer />
        <BottomNav />
        <MainDrawer />
    </v-app>
</template>
