import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type FilterType = 'streams' | 'playlists';

export const useArchiveStore = defineStore('archive', () => {
    const router = useRouter();
    const route = useRoute();
    const query = ref<string>();
    const searchEl = ref<HTMLInputElement>();
    const activeFilterType = useRouteQuery<FilterType>('type', 'streams');

    function resetQuery() {
        query.value = null;
    }

    const setSearchEl = (el: HTMLInputElement) => {
        searchEl.value = el;
    };

    watch(query, () => {
        if (route.name === 'archive') return;
        router.push({ name: 'archive' });
    });

    return {
        query,
        activeFilterType,
        searchEl,

        resetQuery,
        setSearchEl,
    };
});
