import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';

export const usePreferenceStore = defineStore('preferences', () => {
    const preferences = useStorage('preferences', {
        showChapters: true,
        showChaptersPeterVsTimon: false,
        showFacecam: false,
        showEmojis: true,
    });

    watch(
        () => preferences.value.showChapters,
        (newShowChapters) => {
            if (newShowChapters) return;
            preferences.value.showChaptersPeterVsTimon = false;
        }
    );

    return {
        preferences,
    };
});
