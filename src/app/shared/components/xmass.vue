<script setup lang="ts">
import { computed } from 'vue';

const show = computed(() => {
    const now = new Date();

    return now.getMonth() === 11 && now.getDate() >= 20 && now.getDate() <= 30;
});
</script>

<template>
    <Admin>
        <!-- <template v-if="show"> -->
        <slot></slot>
        <!-- </template> -->
    </Admin>
</template>
