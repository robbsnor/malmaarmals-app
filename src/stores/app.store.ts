export const useAppStore = defineStore('appStore', () => {
    const header = ref<HTMLElement | null>(null);

    // TODO: Make into directive
    const headerHeight = computed(() => {
        if (header.value) {
            return header.value.offsetHeight;
        }
        return 0;
    });

    return {
        header,
        headerHeight,
    };
});
