<script setup lang="ts">
import { useHistoryStore } from '../../history/stores/history.store';
import HistoryItem from '../../history/components/HistoryItem.vue';

const historyStore = useHistoryStore();
</script>

<template>
    <Section v-if="historyStore.history.length" title="History" moreLink="/history" moreText="view all">
        <div class="flex flex-col gap-4">
            <HistoryItem v-for="video in historyStore.videos.slice(0, 5)" :key="video.id" :video="video" />
        </div>
    </Section>
</template>
