<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Video } from '../../videos/models/video.model.ts';
import { useStatsStore } from '../../stats/stores/stats.store.ts';
import { BucketHelper } from '../../shared/helpers/bucket.helper.ts';

const props = withDefaults(
    defineProps<{
        videos: Video[];
    }>(),
    {}
);

const statsStore = useStatsStore();

const ratio = computed(() => props.videos.length / statsStore.highestStreamPerWeek);
const percentage = computed(() => Math.round(ratio.value * 100));

const colorClass = computed(() => {
    if (percentage.value === 100) return 'bg-gradient-to-br from-[#a1ff0a] to-[#2ea043]';
    else if (percentage.value >= 80) return 'bg-[#1ad339]';
    else if (percentage.value >= 60) return 'bg-[#56d364]';
    else if (percentage.value >= 40) return 'bg-[#2ea043]';
    else if (percentage.value >= 20) return 'bg-[#033a16]';
    else if (percentage.value !== 0) return 'bg-[#196c2e]';
    else return 'bg-black-400';
});
</script>

<template>
    <v-menu location="top" max-width="420">
        <template #activator="{ props }">
            <div
                class="rounded w-full aspect-square flex justify-center items-center"
                :class="colorClass"
                v-bind="props"
            >
                <v-icon v-if="percentage === 100" size="10" class="text-black -mt-0.5">mdi-star</v-icon>
            </div>
        </template>

        <v-list class="max-h-160 overflow-auto rounded-md! bg-black-200! border! border-black-500!">
            <v-list-item v-if="!props.videos.length" class="text-sm text-muted-more"> No streams </v-list-item>

            <v-list-item
                v-for="(video, sIdx) in props.videos"
                :key="video.video_id ?? sIdx"
                :to="{ name: 'stream', params: { id: video.video_id } }"
                link
                class="px-0"
            >
                <div class="flex items-center gap-3 w-full py-2">
                    <img
                        :src="BucketHelper.getThumbnailUrl(video.video_id)"
                        alt="{{ video.title }} thumbnail"
                        class="aspect-video w-20 rounded-md overflow-hidden shrink-0"
                    />

                    <div class="min-w-0">
                        <div class="line-clamp-1 font-bold text-sm text-white">
                            {{ video.title }}
                        </div>

                        <div class="text-xs font-semibold text-muted">
                            {{ new Date(video.recorded_at).toLocaleDateString() }}
                        </div>
                    </div>
                </div>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
