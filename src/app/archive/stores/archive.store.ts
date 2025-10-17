import { useRouteQuery } from '@vueuse/router';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useArchiveStore = defineStore('archive', () => {
    const query = ref<string>('');
    const activeTab = useRouteQuery('type', 'videos');

    return {
        query,
        activeTab,
    };
});
