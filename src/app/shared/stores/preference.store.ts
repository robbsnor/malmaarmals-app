import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';

export const usePreferenceStore = defineStore('preferences', () => {
    const showFloatingEmotes = useStorage('pref-show-floating-emotes', true);
    const showHypeGraph = useStorage('dev-pref-auto-fullscreen', true);
    const showFacecam = useStorage('pref-facecam', false);
    const autoTheatre = useStorage('pref-auto-theatre', false);
    const autoFullscreen = useStorage('pref-auto-fullscreen', false);

    return {
        showFloatingEmotes,
        showHypeGraph,
        showFacecam,
        autoTheatre,
        autoFullscreen,
    };
});
