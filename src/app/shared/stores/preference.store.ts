import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';

export const usePreferenceStore = defineStore('preferences', () => {
    const showFloatingEmotes = useStorage('pref-show-floating-emotes', true);
    const showHypeGraph = useStorage('pref-show-hype-graph', true);
    const showFacecam = useStorage('pref-facecam', false);

    const autoTheatre = useStorage('pref-auto-theatre', false);
    const autoFullscreen = useStorage('pref-auto-fullscreen', false);

    const chatFontScale = useStorage<number>('pref-chat-font-scale', 1);
    const chatWidth = useStorage<number>('pref-chat-width_0789544', 0);

    return {
        showFloatingEmotes,
        showHypeGraph,
        showFacecam,

        autoTheatre,
        autoFullscreen,

        chatFontScale,
        chatWidth,
    };
});
