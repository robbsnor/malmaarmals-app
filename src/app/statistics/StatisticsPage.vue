<script setup lang="ts">
import { TitleHelper } from '../shared/helpers/title.helper';
import WeekOverview from './components/WeekOverview.vue';
import StreamHistoryOverview from './components/StreamHistoryOverview.vue';
import ChaptersOverview from '../home/components/ChaptersOverview.vue';
import WatchHistoryChart from './components/WatchHistoryChart.vue';

TitleHelper.setTitle('statistics');
</script>

<template>
    <WatchHistoryChart />
    <ChaptersOverview />
    <StreamHistoryOverview />
    <WeekOverview />
</template>
