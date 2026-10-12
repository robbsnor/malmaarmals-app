import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useVideoStore } from '../../videos/stores/video.store';

export enum CHAT_SIDE {
    LEFT = 'left',
    RIGHT = 'right',
}

export const usePreferenceStore = defineStore('preferences', () => {
    const videoStore = useVideoStore();

    const drawer = ref(false);

    const showFloatingEmotes = useStorage('pref-show-floating-emotes', true);
    const showHypeGraph = useStorage('pref-show-hype-graph', true);
    const showFacecam = useStorage('pref-facecam', false);

    const showChaptersGeneral = useStorage('pref-chapters', true);
    const showChaptersPVT = useStorage('pref-chapters-pvt', true);
    const showChapters = computed(() => {
        if (videoStore.isPeterVsTimon) {
            return showChaptersGeneral.value && showChaptersPVT.value;
        }

        return showChaptersGeneral.value;
    });

    const autoTheatre = useStorage('pref-auto-theatre', false);
    const autoFullscreen = useStorage('pref-auto-fullscreen', false);

    const chatFontScale = useStorage<number>('pref-chat-font-scale', 1);
    const overwriteChatWidth = useStorage('pref-overwrite-chat-width', false);
    const chatWidth = useStorage<number>('pref-chat-width_92197', 25);
    const chatSide = useStorage('pref-chat-side', CHAT_SIDE.RIGHT);

    return {
        drawer,

        showFloatingEmotes,
        showHypeGraph,
        showFacecam,

        showChaptersGeneral,
        showChaptersPVT,
        showChapters,

        autoTheatre,
        autoFullscreen,

        chatFontScale,

        overwriteChatWidth,
        chatWidth,
        chatSide,
    };
});
