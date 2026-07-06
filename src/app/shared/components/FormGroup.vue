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
        <div class="text-xl uppercase font-bold">{{ props.title }}</div>
        <slot></slot>
    </div>
</template>
