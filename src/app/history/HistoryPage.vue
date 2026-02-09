<script setup lang="ts">
import { useHistoryStore } from './stores/history.store';
import HistoryItem from './components/HistoryItem.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { ref } from 'vue';

TitleHelper.setTitle('history');

const historyStore = useHistoryStore();
const dialog = ref(false);
</script>

<template>
    <div>
        <div class="flex py-2 items-center gap-4 justify-between">
            <v-btn variant="text" icon="mdi-chevron-left" :to="{ name: 'profile' }"></v-btn>

            <v-menu v-if="historyStore.videos.length">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>

                <v-list>
                    <v-list-item @click="dialog = true" class="text-error" prepend-icon="mdi-trash-can-outline">
                        <v-list-item-title>Clear history</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <Section title="History" class="pt-0">
            <div v-if="historyStore.videos.length" class="flex flex-col gap-4">
                <HistoryItem :video="video" v-for="video in historyStore.videos" :key="video.video_id" />
            </div>

            <Empty
                v-else
                title="No videos yet..."
                description="Watched videos will appear here."
                icon="mdi-history"
            ></Empty>

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
    </div>
</template>
