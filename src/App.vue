<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';
</script>

<template>
    <Header />

    <div style="margin-top: var(--header-height)" class="min-h-available bg-pink-400f">
        <RouterView />
    </div>

    <!-- <Footer /> -->
</template>
