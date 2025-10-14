<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/videos/components/VideoContainer.vue';
import MainDrawer from './app/layout/components/MainDrawer.vue';
import { useAppStore } from './app/shared/stores/app.store';
import { useVideosStore } from './app/videos/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted } from 'vue';
import { useAuthStore } from './app/auth/stores/auth.store';

const appStore = useAppStore();
const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();

onMounted(async () => {
    appStore.loading = true;

    // prettier-ignore
    await Promise.all([
        authStore.getSession(),
        videosStore.fetchVideos(),
        playlistsStore.fetchPlaylists(),
    ]);

    appStore.loading = false;
});
</script>

<template>
    <v-app class="pb-[80px]">
        <template v-if="!appStore.loading">
            <div class="fpb-(--height-mobile-navbar)">
                <RouterView />
            </div>

            <VideoContainer />
            <BottomNav />
            <MainDrawer />
        </template>
    </v-app>

    <div v-visible="appStore.loading" class="fixed inset-0 z-100 flex items-center justify-center bg-black">
        <v-progress-circular indeterminate size="64" color="primary" />
    </div>
</template>
