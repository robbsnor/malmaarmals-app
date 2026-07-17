<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string;
    }>(),
    {}
);
</script>

<template>
    <div>
        <div v-if="props.title" class="text-xl font-bold border-l-2 border-primary-darker pl-2 -ml-2">
            {{ props.title }}
        </div>
        <slot></slot>
    </div>
</template>
