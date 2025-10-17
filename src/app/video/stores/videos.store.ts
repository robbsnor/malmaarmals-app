import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import { useArchiveStore } from '../../archive/stores/archive.store';

export const useVideosStore = defineStore('videos', () => {
    const route = useRoute();
    const router = useRouter();
    const archiveStore = useArchiveStore();
    const videos = ref<Tables<'videos'>[]>([]);

    const fetchVideos = async () => {
        const { data, error } = await supabase
            .from('videos')
            // .select('*, categories: video_category_mapping(...categories(*))')
            .select('*')
            .order('recorded_at', { ascending: false });

        videos.value = data;
    };

    const filteredVideos = computed(() => {
        if (!archiveStore.query) return videos.value;

        return videos.value.filter((video) => {
            const titleMatch = video.title.toLowerCase().includes(archiveStore.query.toLowerCase());
            const descriptionMatch =
                video.description && video.description.toLowerCase().includes(archiveStore.query.toLowerCase());
            const idMatch = video.video_id.toString().includes(archiveStore.query);

            return titleMatch || descriptionMatch || idMatch;
        });
    });

    return {
        videos,
        filteredVideos,

        fetchVideos,
    };
});
