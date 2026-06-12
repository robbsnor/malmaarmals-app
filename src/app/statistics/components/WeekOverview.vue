<script setup lang="ts">
import Week from './Week.vue';
import { useStatsStore } from '../../stats/stores/stats.store.ts';

const statsStore = useStatsStore();
</script>

<template>
    <Section title="Stream history" description="Past streams grouped by week.">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-12 gap-y-6 direc">
            <div v-for="year in statsStore.videosByWeek" :key="year.year" class="flex flex-col gap-2 w-full">
                <div>{{ year.year }}</div>

                <div class="flex gap-2">
                    <div v-for="month in year.months" :key="month.month" class="relative w-full">
                        <div class="flex flex-col gap-2 w-full">
                            <Week
                                v-for="(videos, i) in month.weeks"
                                :key="i"
                                class="flex gap-2 flex-col"
                                :videos="videos"
                            >
                            </Week>
                        </div>

                        <div class="pt-1 text-[10px] text-muted-more">
                            {{ month.month.slice(0, 1) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Section>
</template>
