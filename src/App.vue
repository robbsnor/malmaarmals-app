<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';
</script>

<template>
    <v-app>
        <!-- <Header /> -->

        <RouterView />

        <!-- <Footer /> -->
    </v-app>
</template>
