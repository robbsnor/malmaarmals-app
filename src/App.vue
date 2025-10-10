<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import MobileNavbar from './app/layout/components/MobileNavigation.vue';
import { useAppStore } from './app/shared/stores/app.store';

import { useScreenSafeArea } from '@vueuse/core';

const { top, right, bottom, left } = useScreenSafeArea();
</script>

<template>
    <v-app>
        <!-- <Header /> -->

        <div class="pb-(--height-mobile-navbar)">
            <RouterView />
        </div>

        <!-- <Footer /> -->
        <MobileNavbar />
    </v-app>
</template>
