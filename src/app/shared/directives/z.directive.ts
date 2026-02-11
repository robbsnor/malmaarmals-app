import type { Directive } from 'vue';

export const Z = {
    CHAPTER_MARKER: 10,
    MOBILE_NAV: 10,
    ARCHIVE_HEADER: 10,

    VIDEO_CONTAINER: 50,
    VIDEO_CONTROLS: 50,
    VIDEO_SRC_ERROR: 60,

    OFFLINE: 100,
};

export const z: Directive<HTMLElement, typeof Z> = {
    mounted(el, binding) {
        el.style.zIndex = String(binding.value);
    },
    updated(el, binding) {
        el.style.zIndex = String(binding.value);
    },
};
