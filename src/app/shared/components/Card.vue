<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        padding?: string;
    }>(),
    {
        padding: 'p-8',
    }
);
</script>

<template>
    <div :class="props.padding" class="bg-amber-500 rounded-xl">
        <slot></slot>
    </div>
</template>
