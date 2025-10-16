<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useScreenSafeArea } from '@vueuse/core';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../auth/stores/auth.store';

const router = useRouter();
const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();
const authStore = useAuthStore();
const menuItems = ref([
    { title: 'home', icon: 'mdi-home', to: '/' },
    { title: 'streams', icon: 'mdi-play', to: '/videos' },
    { title: 'playlists', icon: 'mdi-playlist-play', to: '/playlists' },
    // { title: 'more', icon: 'mdi-dots-horizontal', action: 'mainDrawer' },
]);

const handleClick = (item: any) => {
    if (item?.action === 'mainDrawer') {
        appStore.mainDrawer = true;
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
            <Component
                :is="item.to ? RouterLink : 'div'"
                v-for="item in menuItems"
                :key="item.title"
                :to="item.to"
                activeClass="text-white"
                class="cursor-pointer flex flex-col justify-center items-center text-muted-more transition-all gap-[2px] py-2 px-6 text-light"
                @click="handleClick(item)"
            >
                <v-icon v-if="item.icon" :icon="item.icon" />
                <div v-if="item.title" class="capitalize text-sm">{{ item.title }}</div>
            </Component>

            <img
                v-if="!!authStore.session"
                :src="authStore.session.user.user_metadata.avatar_url"
                alt=""
                class="h-8 rounded-full cursor-pointer"
                @click="appStore.mainDrawer = true"
            />
            <div
                v-else
                @click="appStore.mainDrawer = true"
                class="size-8 bg-black-600 cursor-pointer rounded-full"
            ></div>
        </div>
    </div>
</template>
