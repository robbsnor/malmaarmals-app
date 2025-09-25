<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';
</script>

<template>
    <v-app>
        <Header />

        <div class="transition-all ease-linear pt-(--height-header)">
            <RouterView />
        </div>

        <!-- <Footer /> -->
    </v-app>
</template>
