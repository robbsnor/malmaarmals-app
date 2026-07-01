<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useVideosStore } from '../videos/stores/videos.store';
import { useArchiveStore } from '../archive/stores/archive.store';
import CategoryCard from '../categories/components/CategoryCardLarge.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import Empty from '../shared/components/Empty.vue';
import { useStatsStore } from '../stats/stores/stats.store.ts';
import WeekOverview from './components/WeekOverview.vue';
import StreamHistoryOverview from './components/StreamHistoryOverview.vue';
import ChaptersOverview from '../home/components/ChaptersOverview.vue';
import WatchHistoryChart from './components/WatchHistoryChart.vue';

TitleHelper.setTitle('statistics');

const videosStore = useVideosStore();
const statsStore = useStatsStore();
const archiveStore = useArchiveStore();
const router = useRouter();
</script>

<template>
    <WatchHistoryChart />
    <ChaptersOverview />
    <StreamHistoryOverview />
    <WeekOverview />
</template>
