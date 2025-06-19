<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import LatestVideo from '../components/LatestVideo.vue';
import Video from '../components/Video.vue';
import GridSection from '../components/GridSection.vue';
import Container from '../components/Container.vue';
import BackGroundGradient from '../components/BackGroundGradient.vue';

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
        .range(0, 1000);

    if (error) {
        console.error('Error fetching videos:', error);
    } else {
        videos.value = data;
    }
};

const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
        console.error('Error fetching categories:', error);
    } else {
        return data;
    }
};

const catImg = (url: string) => {
    return url.replace('40x53', '240x318');
};
</script>

<template>
    <div>
        <LatestVideo v-if="firstVideo" :video="firstVideo" />

        <div class="pb-1g flex flex-col gap-16 pb-32">
            <Container>
                <GridSection v-if="!!otherVideos" title="Recent streams">
                    <Video v-for="video in otherVideos" :key="video.video_id" :video="video" />
                </GridSection>
            </Container>

            <BackGroundGradient class="py-20">
                <Container>
                    <GridSection v-if="categories" title="Popular Categories" :cols="8" class="py-20f">
                        <div v-for="category in categories" :key="category.id" class="relative">
                            <img
                                :src="catImg(category.image_url)"
                                class="pointer-events-none absolute -z-10 w-full scale-200 overflow-hidden rounded-[99%] object-cover opacity-20 blur-2xl select-none"
                            />
                            <img :src="catImg(category.image_url)" alt="" class="w-full rounded-md" />
                        </div>
                    </GridSection>
                </Container>
            </BackGroundGradient>

            <Container>
                <GridSection v-if="otherVideos" title="Playlists" :cols="5">
                    <Video v-for="video in fakePlaylist" :key="video.video_id" :video="video" />
                </GridSection>
            </Container>
        </div>
    </div>
</template>
