import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useVideoStore } from '../../videos/stores/video.store';

export const usePreferenceStore = defineStore('preferences', () => {
    const videoStore = useVideoStore();

    const drawer = ref(false);

    const showFloatingEmotes = useStorage('pref-show-floating-emotes', true);
    const showHypeGraph = useStorage('pref-show-hype-graph', true);
    const showFacecam = useStorage('pref-facecam', false);

    const showChapters = useStorage('pref-chapters', true);
    const showChaptersPVT = useStorage('pref-chapters-pvt', true);
    const showChaptersBoth = computed(() => {
        if (videoStore.isPeterVsTimon) {
            return showChapters.value && showChaptersPVT.value;
        }

        return showChapters.value;
    });

    const autoTheatre = useStorage('pref-auto-theatre', false);
    const autoFullscreen = useStorage('pref-auto-fullscreen', false);

    const chatFontScale = useStorage<number>('pref-chat-font-scale', 1);

    const overwriteChatWidth = useStorage('pref-overwrite-chat-width', false);
    const chatWidth = useStorage<number>('pref-chat-width_92197', 25);

    return {
        drawer,

        showFloatingEmotes,
        showHypeGraph,
        showFacecam,

        showChapters,
        showChaptersPVT,
        showChaptersBoth,

        autoTheatre,
        autoFullscreen,

        chatFontScale,

        overwriteChatWidth,
        chatWidth,
    };
});
