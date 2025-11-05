import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';

export const useArchiveStore = defineStore('archive', () => {
    const query = useStorage<string>('archive-query', '', sessionStorage);
    const searchEl = ref<HTMLInputElement>();
    const activeTab = useRouteQuery<'streams' | 'playlists' | 'categories'>('type', 'streams');

    function resetQuery() {
        query.value = '';
        searchEl.value.focus();
    }

    const setSearchEl = (el: HTMLInputElement) => {
        searchEl.value = el;
    };

    return {
        query,
        activeTab,
        searchEl,

        resetQuery,
        setSearchEl,
    };
});
