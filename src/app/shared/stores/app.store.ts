import { useWindowSize } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const isDev = import.meta.env.DEV;

    const loading = ref(true);
    const hasError = ref(false);

    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const isLandscape = computed(() => windowWidth.value > windowHeight.value);

    return {
        isDev,
        loading,
        hasError,
        isLandscape,
    };
});
