export default defineNuxtPlugin((nuxtApp) => {
	const appStore = useAppStore();
	nuxtApp.vueApp.directive("100-vh", {
		mounted(el) {
			console.log(appStore.headerHeight);
			el.style.height = `calc(100vh - 60px)`;
		},
	});
});
