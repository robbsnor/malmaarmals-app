<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import Stats from '../../app/home/components/Stats.vue';
import LatestVideo from './components/LatestVideo.vue';
import Playlists from './components/Playlists.vue';
import { useAppStore } from '../shared/stores/app.store';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../videos/stores/videos.store';
import PrevStreams from './components/PrevStreams.vue';
import { useScreenOrientation } from '@vueuse/core';
import History from './components/History.vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../auth/stores/auth.store';

TitleHelper.setTitle('home');

const appStore = useAppStore();
const videosStore = useVideosStore();
const authStore = useAuthStore();
const { videos } = storeToRefs(videosStore);

const number = ref(0);

const firstVideo = computed(() => videos?.value[number.value]);
const previousVideos = computed(() => videos?.value.slice(1, 6));

const handleArrow = (event: KeyboardEvent) => {
    if (!videos?.value) return;
    if (event.key === 'ArrowRight') {
        if (number.value < videos?.value.length - 1) {
            number.value++;
        }
    } else if (event.key === 'ArrowLeft') {
        if (number.value > 0) {
            number.value--;
        }
    }
};

const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'user:read:follows user:read:subscriptions moderator:read:followers',
            skipBrowserRedirect: false,
        },
    });
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
};
</script>

<template>
    <div v-if="videos">
        <!-- <LatestVideo :video="firstVideo" /> -->

        <Container>
            <div class="flex items-center justify-center py-12 flex-col gap-2 pb-6">
                <div class="w-[200px]">
                    <Logo />
                </div>
                <div class="text-muted">Lekker Spelen Twitch Archive</div>
                <v-btn
                    v-if="authStore.session"
                    variant="tonal"
                    color="primary"
                    class="mt-4"
                    @click="supabase.auth.signOut()"
                >
                    Logout
                </v-btn>
                <v-btn v-else variant="tonal" color="primary" class="mt-4" @click="login()">Login</v-btn>
            </div>
        </Container>

        <PrevStreams />

        <Playlists />

        <History />

        <!-- <Stats /> -->

        <!-- <Section title="Populair Categories">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in previousVideos" :key="video.video_id" :video="video" />
            </div>
        </Section> -->
    </div>
</template>
