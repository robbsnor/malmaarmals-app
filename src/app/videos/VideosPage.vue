<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import Filter from './components/Filter.vue';

const videos = ref<{ data: any[]; error: any }>();

onMounted(async () => {
    videos.value = await fetchVideos();
});

const fetchVideos = async () => {
    const { data, error } = await supabase
        .from('videos')
        .select('*, categories: video_category_mapping(...categories(*))')
        .order('recorded_at', { ascending: false })
        .limit(1000);
    return { data, error };
};

const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
</script>

<template>
    <Container>
        <div v-if="videos?.data" class="grid grid-cols-5 items-center gap-8 p-4 overflow-auto">
            <Video v-for="video in videos.data" :key="video.video_id" :video="video" />
        </div>
    </Container>
</template>
