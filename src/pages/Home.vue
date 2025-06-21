<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import LatestVideo from '../components/LatestVideo.vue';
import Video from '../components/Video.vue';
import GridSection from '../components/GridSection.vue';
import Container from '../components/Container.vue';
import BackGroundGradient from '../components/BackGroundGradient.vue';

// Big most recent video
// smaller latest videos
// playlists
// populair categories

const videos = ref([]);
const categories = ref([]);

const firstVideo = computed(() => videos.value?.[0]);
const otherVideos = computed(() => videos.value?.slice(1));
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
        .range(0, 80);

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

const catImg = (url: string) => {
    return url.replace('40x53', '240x318');
};
</script>

<template>
    <div>
        <!-- <Container v-if="firstVideo">
            <Card :padding="0" style="overflow: hidden">
                <div class="relative h-[600px]">
                    <div class="absolute top-0 right-0 bottom-0 left-0">
                        <img
                            class="w-full h-full object-cover"
                            :src="`http://localhost:8000/thumbnails/${firstVideo.video_id}`"
                            alt=""
                        />
                        <div
                            class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"
                        ></div>
                    </div>

                    <div class="relative z-10 flex h-full w-full flex-col justify-end gap-4 p-8">
                        <h2 class="re bottom-4 left-4 text-3xl font-bold text-white">
                            {{ firstVideo.title }}
                        </h2>
                        <p class="text-lg text-gray-300">
                            {{ firstVideo.description }}
                        </p>
                        <div class="text-sm text-gray-400">
                            {{ firstVideo.categories.map((c) => c.title).join(', ') }}
                        </div>
                    </div>
                </div>
            </Card>
        </Container> -->

        <Container class="font-bold mt-[60px]">
            <h3 class="uppercase pb-8 text-5xl">Latest Videos</h3>
            <div class="grid grid-cols-4 gap-8">
                <Video v-for="video in otherVideos" :key="video.video_id" :video="video" />
            </div>
        </Container>
    </div>
</template>
