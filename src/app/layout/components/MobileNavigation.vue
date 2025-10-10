<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useScreenSafeArea } from '@vueuse/core';
const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();
const menuItems = ref([
    { title: 'home', icon: 'mdi-home', to: '/' },
    { title: 'videos', icon: 'mdi-play', to: '/videos' },
    { title: 'playlists', icon: 'mdi-playlist-play', to: '/playlists' },
]);
</script>

<template>
    <div
        ref="mobileNavRef"
        :style="{ paddingBottom: bottom }"
        class="bottom-0 right-0 left-0 z-100 bg-black fixed transition-transform border-t border-black-500"
        :class="{ 'translate-y-[-100%]': !appStore.headerShown }"
    >
        <div class="flex items-center justify-evenly h-[var(--height-mobile-navbar)]">
            <RouterLink
                v-for="item in menuItems"
                :to="item.to"
                activeClass="text-white"
                :key="item.title"
                class="flex flex-col justify-center items-center text-muted transition-all gap-[2px] py-2 px-6 text-light"
            >
                <v-icon :icon="item.icon" />
                <div class="capitalize text-sm">{{ item.title }}</div>
            </RouterLink>

            <button class="flex flex-col justify-center items-center gap-[2px]">
                <img
                    src="https://static-cdn.jtvnw.net/jtv_user_pictures/e346d390-fe98-4c2a-baae-327288c8c55b-profile_image-300x300.png"
                    alt="Twitch Logo"
                    class="h-6 rounded-full"
                />
                <div class="capitalize text-sm">Settings</div>
            </button>
        </div>
    </div>
</template>
