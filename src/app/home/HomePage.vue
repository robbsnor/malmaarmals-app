<script setup lang="ts">
import Stats from '../../app/home/components/Stats.vue';
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import PrevStreams from './components/PrevStreams.vue';
import History from './components/History.vue';
import { useAuthStore } from '../auth/stores/auth.store';

TitleHelper.setTitle('home');
const authStore = useAuthStore();
</script>

<template>
    <div>
        <!-- <div>accessToken: {{ authStore.twitchAccessToken }}</div>
        <div>refreshToken: {{ authStore.twitchRefreshToken }}</div> -->

        <div class="rounded-b-2xl bg-black-200 mx-2">
            <Container>
                <div class="flex items-center justify-center py-12 flex-col gap-2 pb-8">
                    <div class="w-60">
                        <Logo payoff />
                    </div>
                </div>
            </Container>
        </div>

        <PrevStreams />

        <Playlists />

        <History />
    </div>
</template>
