<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';
import { onMounted } from 'vue';
</script>

<template>
    <Header />

    <div style="margin-top: var(--header-height)" class="min-h-available bg-pink-400f">
        <UApp>
            <RouterView />
        </UApp>
    </div>

    <!-- <Footer /> -->
</template>
