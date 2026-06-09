import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { refDebounced } from '@vueuse/core';
import { useVideosStore } from '../../videos/stores/videos.store';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

export type FilterType = 'streams' | 'playlists' | 'games';

export const useArchiveStore = defineStore('archive', () => {
    const router = useRouter();
    const route = useRoute();
    const videosStore = useVideosStore();
    const playlistsStore = usePlaylistsStore();
    const query = ref<string>();
    const searchEl = ref<HTMLInputElement>();
    const activeFilterType = computed<FilterType>(() => {
        if (route.name === 'playlists') return 'playlists';
        if (route.name === 'games') return 'games';
        return 'streams';
    });

    function resetQuery() {
        query.value = null;
    }

    const setSearchEl = (el: HTMLInputElement) => {
        searchEl.value = el;
    };

    function random() {
        const i = randomNumber(0, videosStore.videos.length);
        query.value = videosStore.videos[i].title;

        router.push({ name: 'streams' });
    }

    watch(query, () => {
        if (route.name === 'streams' || route.name === 'playlists' || route.name === 'games') return;
        router.push({ name: 'streams' });
    });

    return {
        query,
        activeFilterType,
        searchEl,

        resetQuery,
        setSearchEl,
        random,
    };
});
