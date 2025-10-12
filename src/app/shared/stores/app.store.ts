import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const bottomSheet = ref(false);
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
        bottomSheet,

        menuOpen,
        toggleMenu,
        closeMenu,
    };
});
