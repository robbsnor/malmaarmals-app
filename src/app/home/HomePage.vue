<script setup lang="ts">
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import RecentStreams from './components/RecentStreams.vue';
import PopularCategories from './components/PopularCategories.vue';
import WeekOverview from '../statistics/components/WeekOverview.vue';
import Stats from './components/Stats.vue';
import WhatOthersWatch from './components/WhatOthersWatch.vue';
import WatchHistoryChart from './components/WatchHistoryChart.vue';

TitleHelper.setTitle('home');
</script>

<template>
    <div>
        <WatchHistoryChart />

        <Container class="flex items-center justify-center flex-col pt-18 pb-8 lg:pt-20 lg:pb-12">
            <Logo payoff class="relative z-1 w-[80%] lg:w-150" />
        </Container>

        <RecentStreams />
        <Playlists />
        <Stats />
        <WhatOthersWatch />
        <WeekOverview />
        <PopularCategories />
    </div>
</template>
