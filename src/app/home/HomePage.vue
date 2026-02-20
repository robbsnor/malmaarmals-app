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

        <div class="flex items-center h-screen max-h-[20vh] relative">
            <Container class="relative z-1">
                <div class="flex items-center justify-center py-12 flex-col gap-2 pb-8">
                    <Logo payoff />
                </div>
            </Container>

            <div class="pattern-bg absolute top-0 right-0 bottom-0 left-0 pointer-events-none"></div>
            <div
                class="absolute right-0 bottom-0 left-0 h-[50%] bg-gradient-to-t from-black-100 from-10% pointer-events-none"
            ></div>
        </div>

        <PrevStreams />
        <Playlists />
        <!-- <History /> -->
    </div>
</template>

<style scoped>
.pattern-bg {
    background-image: url('/images/sicko.svg');
    background-repeat: repeat;
    background-size: 120px auto;
    background-position: 100px 100px;
    width: 100%;
    filter: invert(0.9);
}
</style>
