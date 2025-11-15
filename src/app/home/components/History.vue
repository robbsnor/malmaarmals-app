<script setup lang="ts">
import { computed } from 'vue';
import { useHistoryStore } from '../../video/stores/history.store';
import HistoryItem from '../../history/components/HistoryItem.vue';

const historyStore = useHistoryStore();
const videos = computed(() => historyStore.videos.slice(0, 5));
</script>

<template>
    <Section v-if="videos.length" title="History" moreLink="/history" moreText="view all">
        <div class="flex flex-col gap-4">
            <HistoryItem :video="video" v-for="video in videos" :key="video.video_id" />
        </div>
    </Section>
</template>
