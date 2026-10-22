<script setup lang="ts">
import { useAppStore } from '../stores/app.store';

const appStore = useAppStore();
</script>

<template>
    <template v-if="appStore.isDev">
        <slot></slot>
    </template>
</template>
