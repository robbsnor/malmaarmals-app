<script setup lang="ts">
import { useScreenSafeArea } from '@vueuse/core';
import Header from './app/layout/components/Header.vue';
import BottomNav from './app/layout/components/BottomNav.vue';
import VideoContainer from './app/videos/components/VideoContainer.vue';
import { useAppStore } from './app/shared/stores/app.store';

const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();

const groups = [
    [
        { name: 'History', link: '/history', icon: 'mdi-history' },
        { name: 'Prefferences', link: '/settings', icon: 'mdi-cog' },
    ],
    [
        { name: 'Statistics', link: '/statistics', icon: 'mdi-chart-line' },
        { name: 'About', link: '/about', icon: 'mdi-information' },
        { name: 'Donate', link: '/donate', icon: 'mdi-heart' },
    ],
    [{ name: 'Sign out', link: '/sign-out', icon: 'mdi-logout' }],
];
</script>

<template>
    <v-app>
        <Header />

        <div class="fpb-(--height-mobile-navbar) pb-[80px]">
            <RouterView />
        </div>

        <VideoContainer />
        <BottomNav />

        <v-bottom-sheet v-model="appStore.bottomSheet" inset>
            <div class="bg-black-200 border border-black-400 p-4 rounded-t-md overflow-auto">
                <div class="flex gap-4 flex-col">
                    <div v-for="(group, index) in groups" :key="index">
                        <div class="flex flex-col gap-0.5">
                            <button
                                v-for="item in group"
                                :key="item.name"
                                @click="appStore.bottomSheet = false"
                                class="w-full text-left px-4 py-3 bg-black-400 hover:bg-black-600 text-normal transition flex gap-3 cursor-pointer items-center first:rounded-t-md last:rounded-b-md"
                                :class="item.name === 'Sign out' ? 'text-red-500' : ''"
                            >
                                <v-icon :icon="item.icon" size="16" />
                                {{ item.name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </v-bottom-sheet>
    </v-app>
</template>
