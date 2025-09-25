<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        text: string;
    }>(),
    {}
);
</script>

<template>
    <div
        class="leading-none inline-block uppercase text-8xl font-bold text-center text-transparent bg-gradient-to-r from-primary to-african-violet-400 bg-clip-text"
    >
        {{ props.text }}
    </div>
</template>
