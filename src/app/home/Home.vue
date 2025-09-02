<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import LatestVideo from '../../app/shared/components/LatestVideo.vue';
import Video from '../app/../shared/components/Video.vue';
import GridSection from '../../app/shared/components/GridSection.vue';
import Container from '../../app/shared/components/Container.vue';

// Big most recent video
// smaller latest videos
// playlists
// populair categories

const videos = ref([]);
const categories = ref([]);

const firstVideo = computed(() => videos.value?.[0]);
const fakePlaylist = computed(() => videos.value?.slice(13, 20));

onMounted(async () => {
    fetchVideos();
    fetchCategories();
});

const fetchVideos = async () => {
    const { data, error } = await supabase
        .from('videos')
        .select('*, categories: video_category_mapping(...categories(*))')
        .order('recorded_at', { ascending: false })
        .range(0, 4);

    if (error) {
        console.error('Error fetching videos:', error);
        return;
    }

    videos.value = data;
};

const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }
    categories.value = data;
};
</script>

<template>
    <div>
        <Container class="font-bold mt-[60px]">
            <h3 class="uppercase pb-8 text-5xl">Latest Videos</h3>
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in videos" :key="video.video_id" :video="video" />
            </div>
        </Container>
    </div>
</template>
