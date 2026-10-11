<script setup lang="ts">
import { useStatsStore } from '../stats/stores/stats.store.ts';

const statsStore = useStatsStore();
</script>

<template>
    <div class="pt-4 flex flex-col gap-4">
        <template v-for="message in statsStore.quotes">
            <RouterLink
                v-if="message.video_id"
                :to="{
                    name: 'stream',
                    params: { id: message.video_id },
                    query: { t: message.offset_sec - 30 },
                }"
                class="link block wrap-break-word"
            >
                {{ message.text }}
            </RouterLink>
        </template>

        <!-- <div v-else class="flex flex-col gap-4">
            <Skeleton v-for="i in 10" :key="i" />
        </div> -->
    </div>
</template>
