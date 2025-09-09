<script setup lang="ts">
import Header from './app/layout/components/Header.vue';
import Footer from './app/layout/components/Footer.vue';
import { useAppStore } from './app/shared/stores/app.store';
</script>

<template>
    <v-app>
        <Header />

        <div style="margin-top: var(--header-height)" class="min-h-available bg-pink-400f">
            <RouterView />
        </div>

        <!-- <Footer /> -->
        <Dev>
            <div class="fixed bottom-8 right-8 z-50">
                <v-speed-dial :open-on-hover="true" location="bottom center" transition="fade-transition">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-fab v-bind="activatorProps" icon="$vuetify"></v-fab>
                    </template>

                    <v-btn href="https://vuetifyjs.com/en/components/all/" target="_blank" icon="$vuetify"></v-btn>
                </v-speed-dial>
            </div>
        </Dev>
    </v-app>
</template>
