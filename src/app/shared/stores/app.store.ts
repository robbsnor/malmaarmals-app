import { type UseElementSizeReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useVideoStore } from '../../video/stores/video.store';

export const useAppStore = defineStore('app', () => {
    const videoStore = useVideoStore();
    const router = useRouter();
    const player = ref({
        isActive: false,
        isMini: true,
    });
    const headerShown = ref(true);
    const menuOpen = ref(false);

    const toggleMenu = () => (menuOpen.value = !menuOpen.value);
    const closeMenu = () => (menuOpen.value = false);

    const hideHeader = () => {
        headerShown.value = false;
        document.documentElement.style.setProperty('--height-header', '0px');
    };

    const showHeader = () => {
        headerShown.value = true;
        document.documentElement.style.setProperty('--height-header', '4rem');
    };

    return {
        player,
        showHeader,
        hideHeader,
        headerShown,

        menuOpen,
        toggleMenu,
        closeMenu,
    };
});
