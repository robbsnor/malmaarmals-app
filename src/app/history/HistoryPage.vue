<script setup lang="ts">
import { useHistoryStore } from '../video/stores/history.store';
import HistoryItem from './components/HistoryItem.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

TitleHelper.setTitle('History');

const historyStore = useHistoryStore();
</script>

<template>
    <Section title="History">
        <!-- <template #actions v-if="historyStore.videos.length"> ({{ historyStore.videos.length }}) </template> -->

        <div v-if="historyStore.videos.length" class="flex flex-col gap-4">
            <HistoryItem :video="video" v-for="video in historyStore.videos" :key="video.video_id" />
        </div>

        <Empty v-else title="No history" icon="mdi-history"></Empty>
    </Section>
</template>
