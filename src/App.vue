<script setup lang="ts">
import Header from './app/shared/components/Header.vue';
</script>

<template>
    <Header />

    <div style="margin-top: var(--header-height)">
        <UApp>
            <RouterView />
        </UApp>
    </div>
</template>
