<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        success?: boolean;
        isLast?: boolean;
        title?: string;
    }>(),
    {
        success: false,
        isLast: false,
    }
);

const icon = computed(() => (props.success ? 'mdi-check-circle' : 'mdi-close-circle'));
const color = computed(() => (props.success ? 'success' : 'var(--color-black-800)'));
</script>

<template>
    <div class="flex gap-4">
        <div class="flex flex-col items-center gap-1">
            <v-icon :color="color" :icon="icon" />
            <div v-if="!props.isLast" class="bg-black-500 w-0.5 h-8"></div>
        </div>
        <div>{{ props.title }}</div>
        <slot></slot>
    </div>
</template>
