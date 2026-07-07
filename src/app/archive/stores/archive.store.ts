import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { refDebounced, useCloned } from '@vueuse/core';
import { useVideosStore } from '../../videos/stores/videos.store';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

export type FilterType = 'streams' | 'playlists' | 'games';
export interface Form {
    query: string;
    years: number[];
    months: number[];
}

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

    const searchEl = ref<HTMLInputElement>();
    const activeFilterType = computed<FilterType>(() => {
        if (route.name === 'playlists') return 'playlists';
        if (route.name === 'games') return 'games';
        return 'streams';
    });

    // form
    const {
        cloned: form,
        sync: formReset,
        isModified: formHasChanges,
    } = useCloned({
        query: null,
        years: [],
        months: [],
    });
    const formHasDateChanges = computed(() => form.value.years.length || form.value.months.length);

    function formResetQuery() {
        form.value.query = null;
    }

    function formResetDates() {
        form.value.years = [];
        form.value.months = [];
    }

    watch(
        form,
        () => {
            if (route.name === 'streams' || route.name === 'playlists' || route.name === 'games') return;
            router.push({ name: 'streams' });

            count.value = INITIAL;
        },
        { deep: true }
    );

    // videos
    function setRandomVideo() {
        formResetDates();

        const i = randomNumber(0, videosStore.videos.length);
        form.value.query = videosStore.videos[i].title;

        router.push({ name: 'streams' });
    }

    const filteredVideos = computed(() => {
        const query = form.value.query?.trim().toLowerCase();
        const hasMonths = form.value.months.length > 0;
        const hasYears = form.value.years.length > 0;

        return videosStore.videos.filter((video) => {
            const date = new Date(video.recorded_at);
            const month = date.getMonth();
            const year = date.getFullYear();

            if (hasMonths && !form.value.months.includes(month)) return false;
            if (hasYears && !form.value.years.includes(year)) return false;
            if (!query) return true;

            const titleMatch = video.title.toLowerCase().includes(query);
            const descriptionMatch = video.description?.toLowerCase().includes(query);
            const idMatch = video.video_id.toString().includes(query);
            const categoryMatch = video.chapters?.some((chapter) =>
                chapter.category?.title.toLowerCase().includes(query)
            );
            const yearMatch = year.toString().includes(query);

            return titleMatch || descriptionMatch || idMatch || categoryMatch || yearMatch;
        });
    });

    // other
    const setSearchEl = (el: HTMLInputElement) => {
        searchEl.value = el;
    };

    function loadMore() {
        count.value += STEP;
    }

    return {
        form,
        formHasChanges,
        formReset,
        formResetQuery,
        formResetDates,

        activeFilterType,
        searchEl,
        filteredVideos,

        count,
        displayed,
        hasMore,
        remaining,
        loadMore,

        formHasDateChanges,

        setSearchEl,
        setRandomVideo,
    };
});
