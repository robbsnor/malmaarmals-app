import type { Directive } from 'vue';

export const Z = {
    OFFLINE: 100,

    CHAPTER_MARKER: 20,
    MOBILE_NAV: 10,
    ARCHIVE_HEADER: 10,

    VIDEO_CONTAINER: 20,
    VIDEO_INFO: 20,
    VIDEO_CONTROLS: 50,

    CHAT: 30,
};

export const z: Directive<HTMLElement, typeof Z> = {
    mounted(el, binding) {
        el.style.zIndex = String(binding.value);
    },
    updated(el, binding) {
        el.style.zIndex = String(binding.value);
    },
};
