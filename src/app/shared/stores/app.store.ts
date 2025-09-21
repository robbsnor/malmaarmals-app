import { type UseElementSizeReturn } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const showHeader = ref(true);
    const headerSize = ref<UseElementSizeReturn | undefined>();
    const menuOpen = ref(false);

    const toggleMenu = () => (menuOpen.value = !menuOpen.value);
    const closeMenu = () => (menuOpen.value = false);

    return {
        showHeader,
        headerSize,
        menuOpen,
        toggleMenu,
        closeMenu,
    };
});
