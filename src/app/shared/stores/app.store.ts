import { defineStore } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import type { Tables } from '../types/database.types';
import { supabase } from '../../../supabase';
import { useRouter } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';

export const useAppStore = defineStore('app', () => {
    const searchQuery = ref('');
    const videos = ref<Tables<'videos'>[]>();
    const router = useRouter();

    const fetchVideos = async () => {
        const { data, error } = await supabase
            .from('videos')
            .select('*, categories: video_category_mapping(...categories(*))')
            .or(`title.ilike.%${searchQuery.value}%,description.ilike.%${searchQuery.value}%`)
            .order('recorded_at', { ascending: false });
        // .limit(50);

        if (error) {
            console.error(error);
            return;
        }

        videos.value = data;
    };
    const debouncedFetchVideos = useDebounceFn(fetchVideos, 500);

    watch(searchQuery, () => {
        if (router.currentRoute.value.path !== '/videos') {
            router.push({ name: 'videos' });
        }

        debouncedFetchVideos();
    });

    onMounted(() => {
        fetchVideos();
    });

    return { searchQuery, videos };
});
