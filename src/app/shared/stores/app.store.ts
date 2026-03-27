import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const loading = ref(true);
    const hasError = ref(false);
    const mainDrawer = ref(false);
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
        menuOpen,
        headerShown,
        mainDrawer,
        loading,
        hasError,

        toggleMenu,
        closeMenu,
        showHeader,
        hideHeader,
    };
});
