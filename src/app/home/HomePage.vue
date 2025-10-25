<script setup lang="ts">
import Stats from '../../app/home/components/Stats.vue';
import LatestVideo from './components/LatestVideo.vue';
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import PrevStreams from './components/PrevStreams.vue';
import History from './components/History.vue';
import { useAuthStore } from '../auth/stores/auth.store';
import { useFetch } from '@vueuse/core';
import { useTwitch } from '../shared/composables/useTwitch.composable';

TitleHelper.setTitle('home');
const authStore = useAuthStore();
authStore.followedStreams.execute();
</script>

<template>
    <div>
        <code v-if="authStore.followedStreams.data">
            <pre>
                {{ authStore.followedStreams.data.data.map((stream) => stream.title) }}
            </pre>
        </code>
        <Container>
            <div class="flex items-center justify-center py-12 flex-col gap-2 pb-6">
                <div class="w-60">
                    <Logo payoff />
                </div>
            </div>
        </Container>

        <PrevStreams />

        <Playlists />

        <History />
    </div>
</template>
