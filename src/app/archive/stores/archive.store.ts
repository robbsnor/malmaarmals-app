import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { refDebounced } from '@vueuse/core';

export type FilterType = 'streams' | 'playlists' | 'games';

export const useArchiveStore = defineStore('archive', () => {
    const router = useRouter();
    const route = useRoute();
    const query = ref<string>();
    const debouncedQuery = refDebounced(query, 200);
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

    watch(debouncedQuery, () => {
        if (route.name === 'streams' || route.name === 'playlists' || route.name === 'games') return;
        router.push({ name: 'streams' });
    });

    return {
        query,
        debouncedQuery,
        activeFilterType,
        searchEl,

        resetQuery,
        setSearchEl,
    };
});
