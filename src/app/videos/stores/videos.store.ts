import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { videosQuery, type Video } from '../models/video.model';
import { TimeHelper } from '../../shared/helpers/time.helper';

export const useVideosStore = defineStore('videos', () => {
    const archiveStore = useArchiveStore();
    const videos = ref<Video[]>([]);

    const fetchVideos = async () => {
        const { data, error } = await videosQuery;
        if (error) throw error;

        const ordered = data.map((video) => ({
            ...video,
            video: video.chapters.sort((a, b) => a.start_s - b.start_s),
        }));

        videos.value = ordered;
    };

    const filteredVideos = computed(() => {
        if (!archiveStore.debouncedQuery) return videos.value;

        return videos.value.filter((video) => {
            const query = archiveStore.debouncedQuery.toLocaleLowerCase();

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

            .sort((a, b) => b.secPlayed - a.secPlayed);
    });

    return {
        videos,
        filteredVideos,
        categoriesList,
        chaptersOverview,
        populairCategories,

        fetchVideos,
    };
});
