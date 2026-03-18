import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';

export const usePreferenceStore = defineStore('preferences', () => {
    const showFloatingEmotes = useStorage('pref-show-floating-emotes', true);
    const showFacecam = useStorage('pref-facecam', false);

    return {
        showFloatingEmotes,
        showFacecam,
    };
});
