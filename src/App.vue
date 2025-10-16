<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/videos/components/VideoContainer.vue';
import MainDrawer from './app/layout/components/MainDrawer.vue';
import { useAppStore } from './app/shared/stores/app.store';
import { useVideosStore } from './app/videos/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted, ref } from 'vue';
import { useAuthStore } from './app/auth/stores/auth.store';

const appStore = useAppStore();
const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
const hasError = ref(false);

onMounted(async () => {
    appStore.loading = true;

    setTimeout(() => {
        if (appStore.loading) {
            console.log('failsafe');
            appStore.loading = false;
            hasError.value = true;
        }
    }, 8000);

    await Promise.all([
        authStore.upadateSession(),
        videosStore.fetchVideos(),
        playlistsStore.fetchPlaylists(),
        // new Promise((r, re) => setTimeout(re, 500)),
    ]).catch((err) => {
        hasError.value = true;
    });

    appStore.loading = false;
});
</script>

<template>
    <v-app v-if="!appStore.loading && !hasError">
        <div class="fpb-(--height-mobile-navbar)">
            <RouterView />
        </div>

        <VideoContainer />
        <BottomNav />
        <MainDrawer />
    </v-app>

    <div v-visible="appStore.loading || hasError" class="fixed inset-0 z-100 bg-black">
        <Container class="h-full">
            <div v-if="appStore.loading" class="h-full w-full flex items-center justify-center">
                <v-progress-circular indeterminate size="64" color="primary" />
            </div>

            <div v-if="hasError" class="flex flex-col items-center gap-8 pt-20">
                <div class="flex justify-center">
                    <div class="w-60">
                        <Logo payoff />
                    </div>
                </div>

                <div class="w-20 h-[1px] bg-black-500 mx-auto"></div>

                <div class="text-center">
                    <div class="text-4xl font-bold pb-2">Oops!</div>
                    <div class="text-muted">
                        <p>
                            Since this App is partially self hosted, <br />
                            it is probably down for maintenance or went up in flames.
                        </p>
                        <p>We'll be back online soon.</p>
                        <img
                            class="inline w-6"
                            src="https://static-cdn.jtvnw.net/emoticons/v2/717918/default/dark/2.0"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>
