<script setup lang="ts">
import { useHistoryStore } from '../../history/stores/history.store';
import HistoryItem from '../../history/components/HistoryItem.vue';

const historyStore = useHistoryStore();
</script>

<template>
    <Section v-if="historyStore.history.length" title="History" moreLink="/history" moreText="view all">
        <div class="flex flex-col gap-4">
            <HistoryItem v-for="history in historyStore.history.slice(0, 5)" :key="history.id" :history="history" />
        </div>
    </Section>
</template>
