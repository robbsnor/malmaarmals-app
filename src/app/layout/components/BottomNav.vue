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
    { title: 'archive', icon: 'mdi-magnify', to: '/archive' },
    // { title: 'playlists', icon: 'mdi-playlist-play', to: '/playlists' },
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
        class="bottom-0 right-0 left-0 z-10 h-[var(--height-mobile-navbar)] bg-black fixed transition-transform border-t border-black-500"
        :class="{ 'translate-y-[-100%]': !appStore.headerShown }"
    >
        <div class="grid grid-cols-3 items-center justify-evenly h-[var(--height-mobile-navbar)]">
            <RouterLink
                v-for="item in menuItems"
                :key="item.title"
                :to="item.to"
                activeClass="text-white"
                class="cursor-pointer flex flex-col justify-center items-center text-muted-more transition-all gap-[2px] py-2 px-6 text-light"
                @click="handleClick(item)"
            >
                <v-icon v-if="item.icon" :icon="item.icon" />
                <!-- <div v-if="item.title" class="capitalize text-sm">{{ item.title }}</div> -->
            </RouterLink>

            <div
                @click="appStore.mainDrawer = true"
                class="cursor-pointer flex flex-col justify-center items-center text-muted-more transition-all gap-[2px] py-2 px-6 text-light"
            >
                <img
                    v-if="!!authStore.session"
                    :src="authStore.session.user.user_metadata.avatar_url"
                    alt=""
                    class="h-8 rounded-full cursor-pointer"
                />
                <div
                    v-else
                    class="size-8 bg-primary cursor-pointer rounded-full flex items-end justify-center overflow-hidden text-white/50!"
                >
                    <svg
                        width="26"
                        height="26"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="translate-y-0.5"
                    >
                        <path
                            d="M8 10.5C9.28971 10.5 11.2264 10.8143 12.8271 11.4521C13.6271 11.7709 14.3122 12.158 14.7891 12.6016C15.2616 13.0412 15.5 13.5055 15.5 14V15.5H0.5V14C0.5 13.5055 0.738403 13.0412 1.21094 12.6016C1.68776 12.158 2.37288 11.7709 3.17285 11.4521C4.77358 10.8143 6.71029 10.5 8 10.5ZM8 0.5C9.92386 0.5 11.5 2.07614 11.5 4C11.5 5.92386 9.92386 7.5 8 7.5C6.07614 7.5 4.5 5.92386 4.5 4C4.5 2.07614 6.07614 0.5 8 0.5Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
