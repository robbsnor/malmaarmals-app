<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MonthOverview, YearOverview } from './StreamHistoryOverview.vue';

const props = withDefaults(
    defineProps<{
        highestStreamPerMonth: number;
        year: YearOverview;
        month: MonthOverview;
    }>(),
    {}
);

const ratio = computed(() => props.month.streams.length / props.highestStreamPerMonth);
const percentage = computed(() => Math.round(ratio.value * 100));

const monthColorClass = computed(() => {
    if (percentage.value === 100) return 'bg-gradient-to-br from-yellow-500 to-red-500';
    else if (percentage.value >= 80) return 'bg-[#1ad339]';
    else if (percentage.value >= 60) return 'bg-[#56d364]';
    else if (percentage.value >= 40) return 'bg-[#2ea043]';
    else if (percentage.value >= 20) return 'bg-[#033a16]';
    else if (percentage.value !== 0) return 'bg-[#196c2e]';
    else return 'bg-black-400';
});

const isCurrentMonth = computed(() => {
    const now = new Date();
    return now.getFullYear() === props.year.year && now.getMonth() === props.month.monthIndex;
});
</script>

<template>
    <div>
        <div
            class="w-full aspect-square flex items-center justify-center rounded transition duration-150 hover:brightness-125"
            :class="[monthColorClass, isCurrentMonth && 'bg-gradient-to-br from-primary to-primary-darker']"
            :title="`${props.month.monthName}: ${props.month.streams.length} stream${props.month.streams.length === 1 ? '' : 's'}`"
        >
            <v-icon v-if="isCurrentMonth" class="text-white" size="12">mdi-calendar-today</v-icon>
            <v-icon v-else-if="percentage === 100" class="text-white" size="12">mdi-star</v-icon>
        </div>

        <div class="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-more">
            {{ month.monthName }}
        </div>
    </div>
</template>
