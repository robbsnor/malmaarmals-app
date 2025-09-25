import { type UseElementSizeReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const headerShown = ref(true);
    const menuOpen = ref(false);

    const toggleMenu = () => (menuOpen.value = !menuOpen.value);
    const closeMenu = () => (menuOpen.value = false);

    const hideHeader = () => {
        headerShown.value = false;
        document.documentElement.style.setProperty('--height-header', '0');
    };

    const showHeader = () => {
        headerShown.value = true;
        document.documentElement.style.setProperty('--height-header', '4rem');
    };

    return {
        showHeader,
        hideHeader,
        headerShown,

        menuOpen,
        toggleMenu,
        closeMenu,
    };
});
