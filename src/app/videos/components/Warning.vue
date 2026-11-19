<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        title: string;
        description?: string;
    }>(),
    {}
);
</script>

<template>
    <div class="rounded-md p-4 flex flex-col bg-black-400 border border-black-600">
        <div v-if="props.title" class="text-2xl font-bold pb-1">{{ props.title }}</div>
        <p v-if="props.description" class="text-muted pb-2">{{ props.description }}</p>
        <slot></slot>
    </div>
</template>
