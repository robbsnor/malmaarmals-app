// composables/usePwaInstall.js
import { ref, onMounted, onUnmounted } from 'vue';

export function usePwaInstall() {
    const isInstalled = ref(false);
    const canInstall = ref(false);
    const deferredPrompt = ref(null);

    const checkStandalone = () => {
        isInstalled.value =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches ||
            (window.navigator as any).standalone === true; // iOS Safari
    };

    const onBeforeInstallPrompt = (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
        canInstall.value = true;
    };

    const onAppInstalled = () => {
        isInstalled.value = true;
        canInstall.value = false;
        deferredPrompt.value = null;
    };

    let mql;
    onMounted(() => {
        checkStandalone();
        mql = window.matchMedia('(display-mode: standalone)');
        mql.addEventListener('change', checkStandalone);

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onAppInstalled);
    });

    onUnmounted(() => {
        mql?.removeEventListener('change', checkStandalone);
        window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.removeEventListener('appinstalled', onAppInstalled);
    });

    const promptInstall = async () => {
        if (!deferredPrompt.value) return null;
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;
        deferredPrompt.value = null;
        canInstall.value = false;
        return outcome;
    };

    return { isInstalled, canInstall, promptInstall };
}
