<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { useMessagesStore } from '../stores/messages.store';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const preferenceStore = usePreferenceStore();
const messagesStore = useMessagesStore();
</script>

<template>
    <v-expand-transition>
        <div
            v-if="preferenceStore.showHypeGraph && messagesStore.messagesPerPercent.length"
            class="absolute top-[13.5px] -translate-y-full w-full opacity-30 pointer-events-none"
        >
            <v-sparkline
                class="-mb-[1px]"
                color="white"
                :fill="true"
                :padding="0"
                :line-width="2"
                :smooth="8"
                :height="50"
                :width="1000"
                :model-value="messagesStore.messagesPerPercent"
            />
            <div class="h-1 bg-white"></div>
        </div>
    </v-expand-transition>
</template>
