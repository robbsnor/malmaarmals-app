<script setup lang="ts">
import { computed, ref } from 'vue';

const isDev = ref(process.env.NODE_ENV === 'development');
</script>

<template>
    <template v-if="isDev">
        <slot></slot>
    </template>
</template>
