<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        class?: string;
        pulse?: boolean;
    }>(),
    {
        pulse: true,
    }
);
const _class = computed(() => {
    const base = ['bg-black-600', 'rounded-md'];
    if (props.pulse) base.push('animate-pulse');

    return twMerge(...base, props.class);
});
</script>

<template>
    <div :class="_class"></div>
</template>
