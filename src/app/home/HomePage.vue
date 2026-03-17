<script setup lang="ts">
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import RecentStreams from './components/RecentStreams.vue';
import History from './components/History.vue';
import PopularCategories from './components/PopularCategories.vue';
import { onMounted, ref } from 'vue';
import { supabase } from '../../supabase';

TitleHelper.setTitle('home');
const missing = ref<any[]>();

onMounted(async () => {
    //@ts-ignore
    const { data, error } = await supabase.rpc('get_videos_without_messages');
    if (error) {
        console.log('oopsie');
        throw error;
    }
    console.log(data);
    missing.value = data;
});
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
        <!-- <History /> -->
        <PopularCategories />
    </div>
</template>
