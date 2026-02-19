import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useArchiveStore = defineStore('archive', () => {
    const router = useRouter();
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

    watch(query, () => {
        console.log('weuroiweuro');
        router.push({ name: 'archive' });
    });

    return {
        query,
        activeTab,
        searchEl,

        resetQuery,
        setSearchEl,
    };
});
