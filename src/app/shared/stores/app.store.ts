import { useRoute, useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { computed, onMounted, ref, useTemplateRef, watch, watchEffect, type ShallowRef, type TemplateRef } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../types/database.types';
import { type UseElementSizeReturn } from '@vueuse/core';

export const useAppStore = defineStore('app', () => {
    const route = useRoute();
    const router = useRouter();

    const query = ref<string>('');
    const videos = ref<Tables<'videos'>[]>(null);
    const showHeader = ref(true);
    const headerSize = ref<UseElementSizeReturn | undefined>();
    const menuOpen = ref(false);

    onMounted(async () => {
        await fetchVideos();
    });

    const toggleMenu = () => (menuOpen.value = !menuOpen.value);
    const closeMenu = () => (menuOpen.value = false);

    const fetchVideos = async () => {
        const { data, error } = await supabase
            .from('videos')
            // .select('*, categories: video_category_mapping(...categories(*))')
            .select('*')
            .order('recorded_at', { ascending: false });

        videos.value = data;
    };

    const filteredVideos = computed(() => {
        if (!query.value) return videos.value;

        return videos.value.filter((video) => {
            const titleMatch = video.title.toLowerCase().includes(query.value.toLowerCase());
            const descriptionMatch =
                video.description && video.description.toLowerCase().includes(query.value.toLowerCase());
            const idMatch = video.video_id.toString().includes(query.value);

            return titleMatch || descriptionMatch || idMatch;
        });
    });

    const goToVideosPage = () => {
        if (route.name === 'videos') return;
        router.push({ name: 'videos' });
    };

    watch(query, () => goToVideosPage());

    return {
        videos,
        fetchVideos,
        filteredVideos,
        query,
        showHeader,
        headerSize,
        menuOpen,
        toggleMenu,
        goToVideosPage,
        closeMenu,
    };
});
