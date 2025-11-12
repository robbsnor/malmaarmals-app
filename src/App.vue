<script setup lang="ts">
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/video/components/VideoContainer.vue';
import MainDrawer from './app/layout/components/MainDrawer.vue';
import { useVideosStore } from './app/video/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { onMounted, ref } from 'vue';
import { useAuthStore } from './app/auth/stores/auth.store';
import { sleep } from './app/shared/helpers/sleep';
import { Z } from './app/shared/directives/z.directive';

const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
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

    <div v-visible="loading || hasError" class="fixed inset-0 bg-black" v-z="Z.OFFLINE">
        <Container class="h-full">
            <div v-if="loading" class="h-full w-full flex items-center justify-center">
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
                    <div class="text-4xl font-bold pb-2">Oops,</div>
                    <div class="text-muted">
                        <p>
                            Since this App is partially self hosted, <br />
                            it is probably down for maintenance or went up in flames.
                        </p>
                        <p>We'll be back soon.</p>
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
