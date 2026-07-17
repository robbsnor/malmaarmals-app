<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <Auth>
        <div
            v-if="videoStore.showHypeGraph && videoStore.messagesPerPercent.length"
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
                :model-value="videoStore.messagesPerPercent"
            />
            <div class="h-1 bg-white"></div>
        </div>
    </Auth>
</template>
