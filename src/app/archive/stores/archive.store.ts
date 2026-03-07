import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useArchiveStore = defineStore('archive', () => {
    const router = useRouter();
    const route = useRoute();
    const query = ref<string>();
    const searchEl = ref<HTMLInputElement>();
    const amountToShow = ref(100);
    const activeFilterType = useRouteQuery<'streams' | 'playlists' | 'categories'>('type', 'streams');

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
        amountToShow,

        resetQuery,
        setSearchEl,
    };
});
