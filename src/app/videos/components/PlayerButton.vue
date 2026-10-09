<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        icon: string;
        size?: number;
        color?: string;
    }>(),
    {
        size: 24,
    }
);
</script>

<template>
    <button class="relative p-2 hover:bg-black-200/15 transition rounded-md">
        <v-icon :icon="props.icon" :size="props.size" :color="props.color" />
    </button>
</template>
