import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { videosQuery, type Video } from '../models/video.model';
import { TimeHelper } from '../../shared/helpers/time.helper';

export const useVideosStore = defineStore('videos', () => {
    const archiveStore = useArchiveStore();
    const videos = ref<Video[]>([]);

    const INITIAL = 40;
    const STEP = 100;
    const count = ref(INITIAL);
    const displayed = computed(() => filteredVideos.value.slice(0, count.value));
    const hasMore = computed(() => count.value < filteredVideos.value.length);
    const remaining = computed(() => Math.min(STEP, filteredVideos.value.length - count.value));
    const rawDuplicates = [2705617403, 2787106351, 2789497459, 2791017025, 2792463526];

    function loadMore() {
        count.value += STEP;
    }

    const fetchVideos = async () => {
        // temp hide videos that are duplicates from eachother

        const { data, error } = await videosQuery;
        if (error) throw error;

        videos.value = data
            .filter((video) => !rawDuplicates.includes(video.video_id))
            .map((video) => ({
                ...video,
                chapters: video.chapters.sort((a, b) => a.start_s - b.start_s),
            }));
    };

    const filteredVideos = computed(() => {
        if (!archiveStore.query) return videos.value;

        return videos.value.filter((video) => {
            const query = archiveStore.query.toLocaleLowerCase();

            const titleMatch = video.title.toLowerCase().includes(query);
            const descriptionMatch = video.description && video.description.toLowerCase().includes(query);
            const idMatch = video.video_id.toString().includes(query);
            const categoryMatch = video.chapters?.some((chapter) =>
                chapter.category?.title.toLowerCase().includes(query)
            );

            return titleMatch || descriptionMatch || idMatch || categoryMatch;
        });
    });

    const categoriesList = computed(() => {
        const categoriesMap = new Map<string, { id: string; title: string }>();

        videos.value.forEach((video) => {
            video.chapters?.forEach((chapter) => {
                if (chapter.category) {
                    categoriesMap.set(chapter.category.category_id, {
                        id: chapter.category.category_id,
                        title: chapter.category.title,
                    });
                }
            });
        });

        return Array.from(categoriesMap.values()).sort((a, b) => a.title.localeCompare(b.title));
    });

    const chaptersOverview = computed(() => {
        const videosWithChapters = videos.value.filter((video) => video.chapters.length);
        const videosWithoutChapters = videos.value.filter((video) => !video.chapters.length);

        return [...videosWithChapters, ...videosWithoutChapters];
    });

    const populairCategories = computed(() => {
        const categoriesMap = new Map<
            string,
            {
                id: string;
                title: string;
                timePlayed: string;
                timesPlayed: number;
                streamCount: number;
                secPlayed: number;
                streamIds: Set<number>;
            }
        >();

        videos.value.forEach((video) => {
            video.chapters.forEach((chapter) => {
                if (!chapter.category) return;

                const duration = Math.max(0, chapter.end_s - chapter.start_s);
                const existing = categoriesMap.get(chapter.category.category_id);

                if (!existing) {
                    const streamIds = new Set<number>([video.video_id]);
                    categoriesMap.set(chapter.category.category_id, {
                        id: chapter.category.category_id,
                        title: chapter.category.title,
                        timesPlayed: 1,
                        streamCount: 1,
                        secPlayed: duration,
                        timePlayed: TimeHelper.formatTime(duration),
                        streamIds,
                    });
                    return;
                }

                existing.streamIds.add(video.video_id);
                const secPlayed = existing.secPlayed + duration;

                categoriesMap.set(chapter.category.category_id, {
                    ...existing,
                    timesPlayed: existing.timesPlayed + 1,
                    streamCount: existing.streamIds.size,
                    secPlayed,
                    timePlayed: TimeHelper.formatTime(secPlayed),
                });
            });
        });

        return Array.from(categoriesMap.values())
            .sort((a, b) => b.secPlayed - a.secPlayed)
            .map((c, i) => ({ ...c, position: i + 1 }));
    });

    watch(
        () => archiveStore.query,
        () => {
            count.value = INITIAL;
        }
    );

    return {
        videos,
        filteredVideos,
        categoriesList,
        chaptersOverview,
        populairCategories,
        rawDuplicates,

        count,
        displayed,
        hasMore,
        remaining,
        loadMore,

        fetchVideos,
    };
});
