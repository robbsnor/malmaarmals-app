<script setup lang="ts">
import { useHistoryStore } from '../video/stores/history.store';
import HistoryItem from './components/HistoryItem.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { ref } from 'vue';

TitleHelper.setTitle('History');

const historyStore = useHistoryStore();
const dialog = ref(false);
</script>

<template>
    <Section title="History">
        <template #actions v-if="historyStore.videos.length">
            <v-btn append-icon="mdi-trash-can" color="red" variant="tonal" size="small" @click="dialog = true">
                delete
            </v-btn>
        </template>

        <div v-if="historyStore.videos.length" class="flex flex-col gap-4">
            <HistoryItem :video="video" v-for="video in historyStore.videos" :key="video.video_id" />
        </div>

        <Empty v-else title="No history" icon="mdi-history"></Empty>

        <DeleteDialog
            v-model="dialog"
            title="Clear history"
            description="Are you sure you want to clear your history?"
            confirmText="Clear"
            icon="mdi-trash-can"
            :showBody="false"
            @confirm="historyStore.deleteAll"
        />
    </Section>
</template>
