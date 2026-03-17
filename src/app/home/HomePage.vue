<script setup lang="ts">
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import RecentStreams from './components/RecentStreams.vue';
import History from './components/History.vue';
import PopulairCategories from './components/PopulairCategories.vue';

TitleHelper.setTitle('home');
</script>

<template>
    <div>
        <!-- <div>accessToken: {{ authStore.twitchAccessToken }}</div>
        <div>refreshToken: {{ authStore.twitchRefreshToken }}</div> -->

        <Container class="flex items-center justify-center flex-col pt-18 pb-8 lg:pt-20 lg:pb-12">
            <Logo payoff class="relative z-1 w-[80%] lg:w-150" />
        </Container>

        <RecentStreams />
        <Playlists />
        <History />
        <PopulairCategories />
    </div>
</template>
