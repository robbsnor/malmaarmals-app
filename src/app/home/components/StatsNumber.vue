<script setup lang="ts">
import { computed } from 'vue';
import StatCard from './StatCard.vue';

const props = withDefaults(
    defineProps<{
        title: string;
        stat: string;
    }>(),
    {}
);
</script>

<template>
    <StatCard class="flex flex-col gap-2 items-center justify-center h-full">
        <div class="font-bold text-text-muted text-4xl">{{ title }}</div>
        <div class="text-6xl font-bold">
            {{ stat }}
        </div>
    </StatCard>
</template>
