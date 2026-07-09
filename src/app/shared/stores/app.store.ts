import { useWindowSize } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const isDev = import.meta.env.DEV;
    const loading = ref(true);
    const hasError = ref(false);
    const mainDrawer = ref(false);
    const headerShown = ref(true);
    const menuOpen = ref(false);
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const isLandscape = computed(() => windowWidth.value > windowHeight.value);

    function toggleMenu() {
        menuOpen.value = !menuOpen.value;
    }

    function closeMenu() {
        menuOpen.value = false;
    }

    function hideHeader() {
        headerShown.value = false;
        document.documentElement.style.setProperty('--height-header', '0px');
    }

    function showHeader() {
        headerShown.value = true;
        document.documentElement.style.setProperty('--height-header', '4rem');
    }

    return {
        isDev,
        menuOpen,
        headerShown,
        mainDrawer,
        loading,
        hasError,
        isLandscape,

        toggleMenu,
        closeMenu,
        showHeader,
        hideHeader,
    };
});
