import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useArchiveStore = defineStore('archive', () => {
    const query = useStorage<string>('archive-query', '', sessionStorage);
    const activeTab = useRouteQuery<'streams' | 'playlists' | 'categories'>('type', 'streams');

    function resetQuery() {
        query.value = '';
    }

    return {
        query,
        activeTab,

        resetQuery,
    };
});
