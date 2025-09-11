<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';

const appStore = useAppStore();
</script>

<template>
    <v-app>
        <Header />

        <div
            class="transition-all ease-linear"
            :style="{
                paddingTop: appStore.showHeader ? appStore.headerSize?.height + 'px' : '0px',
            }"
        >
            <RouterView />
        </div>

        <!-- <Footer /> -->
    </v-app>
</template>
