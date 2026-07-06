import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { videosQuery, type Video } from '../models/video.model';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { supabase } from '../../../supabase';

export const useVideosStore = defineStore('videos', () => {
    const archiveStore = useArchiveStore();
    const videos = ref<Video[]>([]);

    const rawDuplicates = [2705617403, 2787106351, 2789497459, 2791017025, 2792463526];
    const whatOthersWatchIds = ref([]);

    onMounted(async () => {
        await fetchWhatOthersWatch();
    });

    const fetchVideos = async () => {
        const { data, error } = await videosQuery;
        if (error) throw error;

        videos.value = data
            .filter((video) => !rawDuplicates.includes(video.video_id))
            .map((video) => ({
                ...video,
                chapters: video.chapters.sort((a, b) => a.start_s - b.start_s),
            }));
    };

    async function fetchWhatOthersWatch() {
        const { data, error } = await supabase.functions.invoke('what-others-watch');
        if (error) throw console.error('Error calling function:', error);

        whatOthersWatchIds.value = data;
    }

    const categoriesList = computed(() => {
        const categoriesMap = new Map<string, { id: string; title: string }>();

        videos.value.forEach((video) => {
            video.chapters?.forEach((chapter) => {
                if (!chapter.category) return;

                categoriesMap.set(chapter.category.category_id, {
                    id: chapter.category.category_id,
                    title: chapter.category.title,
                });
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

    const whatOthersWatch = computed(() =>
        whatOthersWatchIds.value?.map((id) => videos.value?.find((v) => v.id === id))
    );
    const years = computed(() => [...new Set(videos.value.map((v) => new Date(v.recorded_at).getFullYear()))]);

    return {
        videos,
        categoriesList,
        chaptersOverview,
        populairCategories,
        rawDuplicates,
        whatOthersWatch,
        years,

        fetchVideos,
    };
});
