<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import Filter from './components/Filter.vue';
import type { Tables } from '../shared/types/database.types';
import { useAppStore } from '../shared/stores/app.store';
import { useDebounceFn } from '@vueuse/core';

const appStore = useAppStore();

onMounted(async () => {
    // videos.value = await fetchVideos();
});

const videos = ref<Tables<'videos'>[]>();

const fetchVideos = async () => {
    const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${appStore.searchQuery}%,description.ilike.%${appStore.searchQuery}%`);

    if (error) {
        console.error(error);
        return;
    }

    videos.value = data;
    console.log(data.length);
};

// const fetchVideos = async () => {
//     const { data, error } = await supabase
//         .from('videos')
//         .select('*, categories: video_category_mapping(...categories(*))')
//         .order('recorded_at', { ascending: false })
//         .limit(1000);
//     return { data, error };
// };

// const formattedDate = (date: string) => {
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//     });
// };
</script>

<template>
    <Container>
        <code>
            <pre>
                {{ videos }}
            </pre>
        </code>
        <!-- <div v-if="videos?.data" class="grid grid-cols-5 items-center gap-8 p-4 overflow-auto">
            <Video v-for="video in videos.data" :key="video.video_id" :video="video" />
        </div> -->
    </Container>
</template>
