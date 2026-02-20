<script setup lang="ts">
import Stats from '../../app/home/components/Stats.vue';
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import PrevStreams from './components/PrevStreams.vue';
import History from './components/History.vue';
import { useAuthStore } from '../auth/stores/auth.store';
import SearchHero from '../archive/components/SearchHero.vue';

TitleHelper.setTitle('home');
const authStore = useAuthStore();
</script>

<template>
    <div>
        <!-- <div>accessToken: {{ authStore.twitchAccessToken }}</div>
        <div>refreshToken: {{ authStore.twitchRefreshToken }}</div> -->
        <PrevStreams />
        <Playlists />
        <!-- <History /> -->
    </div>
</template>
