<script setup lang="ts">
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/video/components/VideoContainer.vue';
import { useVideosStore } from './app/video/stores/videos.store';
import { usePlaylistsStore } from './app/playlists/stores/playlists.store';
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from './app/auth/stores/auth.store';
import { sleep } from './app/shared/helpers/sleep';
import { useHistoryStore } from './app/history/stores/history.store';
import Offline from './app/layout/components/Offline.vue';
import Footer from './app/layout/components/Footer.vue';
import { supabase } from './supabase';
import Header from './app/layout/components/Header.vue';
import SearchHero from './app/archive/components/SearchHero.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const videosStore = useVideosStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
const historyStore = useHistoryStore();
const loading = ref(true);
const hasError = ref(false);

onMounted(async () => {
    // const { data, error } = await supabase.functions.invoke('search-categories', {
    //     body: { query: 'programming' },
    // });
    // console.log(data, error);
    // const { data: helloData, error: helloError } = await supabase.functions.invoke('ping');
    // console.log(helloData, helloError);

    loading.value = true;

    setTimeout(() => {
        if (loading.value) {
            console.log('failsafe');
            loading.value = false;
            hasError.value = true;
        }
    }, 20_000);

    await authStore.mirrorSession();

    if (authStore.session) {
        await authStore.updateIsSubscribed();
    }

    await Promise.all([videosStore.fetchVideos(), playlistsStore.fetchPlaylists(), historyStore.fetchHistory()]).catch(
        async (err) => {
            await sleep(800);
            hasError.value = true;
        }
    );

    loading.value = false;
});
</script>

<template>
    <v-app v-if="!loading && !hasError">
        <Header />

        <div class="grid h-full" style="grid-template-rows: 1fr auto">
            <div class="pb-mobile-navbar lg:pt-header lg:pb-0">
                <SearchHero v-show="route.meta.showSearch" />
                <RouterView />
            </div>

            <Footer />
        </div>

        <BottomNav />
        <VideoContainer />
    </v-app>

    <Offline :loading="loading" :hasError="hasError" />
</template>
