<script setup lang="ts">
import { useScreenSafeArea } from '@vueuse/core';
import Header from './app/layout/components/Header.vue';
import MobileNavbar from './app/layout/components/MobileNavigation.vue';
import VideoContainer from './app/video/VideoContainer.vue';

const { top, right, bottom, left } = useScreenSafeArea();
</script>

<template>
    <v-app>
        <Header />

        <div class="fpb-(--height-mobile-navbar) pb-[80px]">
            <RouterView />
        </div>

        <VideoContainer />
        <MobileNavbar />
    </v-app>
</template>
