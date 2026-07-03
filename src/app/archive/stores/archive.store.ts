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

    const INITIAL = 40;
    const STEP = 100;
    const count = ref(INITIAL);
    const displayed = computed(() => filteredVideos.value.slice(0, count.value));
    const hasMore = computed(() => count.value < filteredVideos.value.length);
    const remaining = computed(() => Math.min(STEP, filteredVideos.value.length - count.value));

    const query = ref<string>();
    const searchEl = ref<HTMLInputElement>();
    const activeFilterType = computed<FilterType>(() => {
        if (route.name === 'playlists') return 'playlists';
        if (route.name === 'games') return 'games';
        return 'streams';
    });

    function loadMore() {
        count.value += STEP;
    }

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

    const filteredVideos = computed(() => {
        if (!query.value) return videosStore.videos;

        return videosStore.videos.filter((video) => {
            const q = query.value.toLocaleLowerCase();

            const titleMatch = video.title.toLowerCase().includes(q);
            const descriptionMatch = video.description && video.description.toLowerCase().includes(q);
            const idMatch = video.video_id.toString().includes(q);
            const categoryMatch = video.chapters?.some((chapter) => chapter.category?.title.toLowerCase().includes(q));
            const yearMatch = new Date(video.recorded_at).getFullYear().toString() === q;

            return titleMatch || descriptionMatch || idMatch || categoryMatch || yearMatch;
        });
    });

    watch(query, () => {
        if (route.name === 'streams' || route.name === 'playlists' || route.name === 'games') return;
        router.push({ name: 'streams' });
    });

    watch(
        () => query,
        () => {
            count.value = INITIAL;
        }
    );

    return {
        query,
        activeFilterType,
        searchEl,
        filteredVideos,

        count,
        displayed,
        hasMore,
        remaining,
        loadMore,

        resetQuery,
        setSearchEl,
        random,
    };
});
