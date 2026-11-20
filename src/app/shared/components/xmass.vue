<script setup lang="ts">
import { computed } from 'vue';

const show = computed(() => {
    const now = new Date();
    return now.getMonth() === 11 && now.getDate() >= 17;
});
</script>

<template>
    <template v-if="show">
        <slot></slot>
    </template>
</template>
