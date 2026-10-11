<script setup lang="ts">
import { useStatsStore } from '../stats/stores/stats.store.ts';
import { useVideosStore } from '../videos/stores/videos.store.ts';
import { TimeHelper } from '../shared/helpers/time.helper.ts';

const statsStore = useStatsStore();
const videosStore = useVideosStore();
</script>

<template>
    <div class="pt-4">
        <v-expansion-panels>
            <v-expansion-panel title="quotes">
                <v-expansion-panel-text>
                    <div class="pt-4 flex flex-col gap-4">
                        <template v-for="message in statsStore.quotes">
                            <RouterLink
                                v-if="message.video_id"
                                :to="{
                                    name: 'stream',
                                    params: { id: message.video_id },
                                    query: { t: message.offset_sec - 10 },
                                }"
                                class="link block wrap-break-word"
                            >
                                <span class="font-mono">{{ TimeHelper.formatTime(message.offset_sec) }} - </span>
                                <span>
                                    {{ videosStore.videos.find((v) => v.video_id === message.video_id)?.title }}
                                </span>
                            </RouterLink>
                        </template>
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>
