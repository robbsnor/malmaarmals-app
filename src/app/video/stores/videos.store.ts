import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { videosQuery, type Video } from '../models/videos-with-chapters.model';

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

    return {
        videos,
        filteredVideos,
        categoriesList,
        chaptersOverview,

        fetchVideos,
    };
});
