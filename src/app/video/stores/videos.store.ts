import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { videosWithChaptersQuery, type VideoWithChapters } from '../models/videos-with-chapters.model';

export const useVideosStore = defineStore('videos', () => {
    const archiveStore = useArchiveStore();
    const videos = ref<VideoWithChapters[]>([]);
    const amountToShow = ref(100);

    const fetchVideos = async () => {
        const { data, error } = await videosWithChaptersQuery;
        if (error) throw error;

        videos.value = data;
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
        const categoriesSet = new Set<string>();

        videos.value.forEach((video) => {
            video.chapters?.forEach((chapter) => {
                if (chapter.category) {
                    categoriesSet.add(chapter.category.title);
                }
            });
        });

        return Array.from(categoriesSet).sort();
    });

    return {
        videos,
        filteredVideos,
        categoriesList,
        amountToShow,

        fetchVideos,
    };
});
