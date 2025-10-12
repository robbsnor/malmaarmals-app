<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useScreenSafeArea } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();
const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();
const menuItems = ref([
    { title: 'home', icon: 'mdi-home', to: '/' },
    { title: 'streams', icon: 'mdi-play', to: '/videos' },
    { title: 'playlists', icon: 'mdi-playlist-play', to: '/about' },
    { title: 'settings', icon: 'mdi-cog', to: '', isSettings: true },
]);

const handleClick = (item: (typeof menuItems.value)[number]) => {
    console.log(item);
    if (item.isSettings) {
        appStore.bottomSheet = true;
    }
};
</script>

<template>
    <div
        ref="mobileNavRef"
        :style="{ paddingBottom: bottom }"
        class="bottom-0 right-0 left-0 z-10 bg-black fixed transition-transform border-t border-black-500"
        :class="{ 'translate-y-[-100%]': !appStore.headerShown }"
    >
        <div class="flex items-center justify-evenly h-[var(--height-mobile-navbar)]">
            <RouterLink
                v-for="item in menuItems"
                activeClass="text-white"
                :key="item.title"
                :to="item.to"
                @click="handleClick(item)"
                class="cursor-pointer flex flex-col justify-center items-center text-muted transition-all gap-[2px] py-2 px-6 text-light"
            >
                <v-icon v-if="item.icon" :icon="item.icon" />
                <div v-if="item.title" class="capitalize text-sm">{{ item.title }}</div>
            </RouterLink>
        </div>
    </div>
</template>
