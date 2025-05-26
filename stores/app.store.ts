export const useAppStore = defineStore("appStore", () => {
	const header = ref<HTMLElement | null>(null);

	// TODO: Make into directive
	const bodyHeight = computed(() => {
		if (header.value) {
			return `calc(100vh - ${header.value.offsetHeight}px)`;
		}
		return "100vh";
	});

	return {
		header,
		bodyHeight,
	};
});
