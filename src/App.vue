<script setup lang="ts">
import { useScreenSafeArea } from '@vueuse/core';
import Header from './app/layout/components/Header.vue';
import MobileNavbar from './app/layout/components/MobileNavigation.vue';
import VideoContainer from './app/video/VideoContainer.vue';
import { useAppStore } from './app/shared/stores/app.store';

const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();

const groups = [
    {
        name: 'Main',
        items: [{ name: 'Settings', link: '/settings', icon: 'mdi-cog' }],
    },
    {
        name: 'User',
        items: [
            { name: 'Statistics', link: '/statistics', icon: 'mdi-chart-line' },
            { name: 'About', link: '/about', icon: 'mdi-information' },
            { name: 'Donate', link: '/donate', icon: 'mdi-heart' },
        ],
    },
    {
        name: 'Account',
        items: [{ name: 'Sign out', link: '/sign-out', icon: 'mdi-logout' }],
    },
];
</script>

<template>
    <v-app>
        <Header />

        <div class="fpb-(--height-mobile-navbar) pb-[80px]">
            <RouterView />
        </div>

        <VideoContainer />
        <MobileNavbar />
        <v-bottom-sheet v-model="appStore.bottomSheet" inset>
            <div class="bg-black-200 p-4 rounded-t-md mx-4">
                <div v-for="group in groups" :key="group.name" class="mb-4">
                    <!-- <div class="text-gray-300 font-semibold mb-2">{{ group.name }}</div> -->
                    <div>
                        <button
                            v-for="item in group.items"
                            :key="item.name"
                            @click="$router.push(item.link)"
                            class="w-full text-left px-3 py-2 mb-0.5 bg-black-400 hover:bg-black-600 text-normal transition flex gap-2 cursor-pointer items-center first:rounded-t-md last:rounded-b-md"
                            :class="item.name === 'Sign out' ? 'text-red-500' : ''"
                        >
                            <v-icon :icon="item.icon" size="16" />
                            {{ item.name }}
                        </button>
                    </div>
                </div>
            </div>
        </v-bottom-sheet>
    </v-app>
</template>
