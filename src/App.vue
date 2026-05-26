<script setup lang="ts">
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/videos/components/VideoContainer.vue';
import { useVideosStore } from './app/videos/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted } from 'vue';
import { Toaster } from 'vue-sonner';
import { useAuthStore } from './app/auth/stores/auth.store';
import { sleep } from './app/shared/helpers/sleep';
import { useHistoryStore } from './app/history/stores/history.store';
import Footer from './app/layout/components/Footer.vue';
import Header from './app/layout/components/Header.vue';
import BackgroundArt from './app/layout/components/BackgroundArt.vue';
import Splash from './app/layout/components/Splash.vue';
import { Analytics } from '@vercel/analytics/vue';
import { useAppStore } from './app/shared/stores/app.store';

const appStore = useAppStore();
const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
const historyStore = useHistoryStore();

onMounted(async () => {
    try {
        appStore.loading = true;
        await authStore.mirrorSession();
        await videosStore.fetchVideos();
        await playlistsStore.fetchPlaylists();

        if (authStore.session) {
            await authStore.updateIsSubscribed();
            await historyStore.fetchHistory();
        }

        // await sleep(900);
    } catch (error) {
        await sleep(1500);
        appStore.hasError = true;
        throw error;
    } finally {
        appStore.loading = false;
    }
});
</script>

<template>
    <v-app v-if="!appStore.loading && !appStore.hasError">
        <BackgroundArt />

        <Header />

        <div class="grid h-full max-lg:pb-mobile-navbar lg:pt-header" style="grid-template-rows: 1fr auto">
            <div class="min-w-0">
                <RouterView />
            </div>

            <Footer />
        </div>

        <BottomNav />
        <VideoContainer />
    </v-app>

    <Splash />
    <Analytics />
    <Toaster position="top-center" closeButtonPosition="top-right" :expand="false" theme="dark" />
</template>
