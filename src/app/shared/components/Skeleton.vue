<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        class?: string;
    }>(),
    {}
);
</script>

<template>
    <div :class="twMerge('bg-black-400 h-4 rounded-md animate-pulse', props.class)"></div>
</template>
