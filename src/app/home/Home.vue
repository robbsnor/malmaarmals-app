<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import Video from '../app/../shared/components/Video.vue';
import Section from '../../app/home/components/Section.vue';
import Stats from '../../app/home/components/Stats.vue';
import type { QueryData } from '@supabase/supabase-js';

const videosQuery = supabase
    .from('videos')
    .select('*, categories: video_category_mapping(...categories(*))')
    .order('recorded_at', { ascending: false })
    .range(0, 5);

type Videos = QueryData<typeof videosQuery>;

const allVideos = ref<Videos>();
const categories = ref([]);
const playlists = ref([
    {
        title: 'Peter VS Timon',
        episodes: 38,
        thumbnails: [
            'http://localhost:8000/thumbnails/2328589668',
            'http://localhost:8000/thumbnails/2230408125',
            'http://localhost:8000/thumbnails/2206408041',
        ],
    },
    {
        title: 'Straf Streams',
        episodes: 24,
        thumbnails: [
            'http://localhost:8000/thumbnails/1901294175',
            'http://localhost:8000/thumbnails/1888466252',
            'http://localhost:8000/thumbnails/1681133900',
        ],
    },
    {
        title: 'Astro Bot',
        episodes: 3,
        thumbnails: [
            'http://localhost:8000/thumbnails/2254460467',
            'http://localhost:8000/thumbnails/2254460467',
            'http://localhost:8000/thumbnails/2254460467',
        ],
    },
    {
        title: 'Mario Party',
        episodes: 2,
        thumbnails: [
            'http://localhost:8000/thumbnails/2328589668',
            'http://localhost:8000/thumbnails/2328589668',
            'http://localhost:8000/thumbnails/2328589668',
        ],
    },
    {
        title: 'Teken streams',
        episodes: 6,
        thumbnails: [
            'http://localhost:8000/thumbnails/2328589668',
            'http://localhost:8000/thumbnails/2328589668',
            'http://localhost:8000/thumbnails/2328589668',
        ],
    },
]);

const firstVideo = computed(() => allVideos.value?.[0]);
const videos = computed(() => allVideos.value?.slice(1));

onMounted(async () => {
    await fetchVideos();
    await fetchCategories();
});

const fetchVideos = async () => {
    const { data, error } = await videosQuery;

    if (error) {
        return console.error('Error fetching videos:', error);
    }

    allVideos.value = data;
};

const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    categories.value = data;
};

const getTimeAgo = (date: string) => {
    const recorded = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - recorded.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);

    return `${diffDays} days ago`;
};
</script>

<template>
    <div>
        <Section :show-gradient="false" v-if="firstVideo">
            <div class="flex justify-center">
                <div class="grid grid-cols-2 gap-10 max-w-5/6">
                    <RouterLink :to="`/videos/${firstVideo.video_id}`">
                        <img
                            :src="`http://localhost:8000/thumbnails/${firstVideo.video_id}`"
                            :alt="`Thumbnail for ${firstVideo.title}`"
                            class="rounded-md"
                        />
                    </RouterLink>

                    <div>
                        <h2 class="text-6xl font-bold">{{ firstVideo.title }}</h2>
                        <div>
                            {{ getTimeAgo(firstVideo.recorded_at) }}
                        </div>
                    </div>
                </div>
            </div>
        </Section>

        <Section title="Streams">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in videos" :key="video.video_id" :video="video" />
            </div>
        </Section>

        <Section title="Playlists">
            <div class="grid grid-cols-5 gap-8 pt-4">
                <div
                    v-for="playlist in playlists"
                    :key="playlist.title"
                    class="relative transition-all duration-200 rounded-md"
                >
                    <RouterLink :to="`/playlists/foo`" class="relative transition-all duration-200 group">
                        <img
                            v-for="(thumbnail, i) in playlist.thumbnails"
                            :key="i"
                            class="absolute inset-0 rounded-md origin-top transition-all"
                            :src="thumbnail"
                            aria-hidden="true"
                            :class="[
                                i === 2
                                    ? '-top-2 scale-95 opacity-60 group-hover:-translate-y-1 group-hover:opacity-30'
                                    : '',
                                i === 1
                                    ? '-top-4 scale-90 opacity-30 group-hover:-translate-y-2 group-hover:opacity-20'
                                    : '',
                            ]"
                        />

                        <img
                            :src="playlist.thumbnails[0]"
                            alt=""
                            class="relative mb-2 aspect-video w-full rounded-md"
                        />
                        <div
                            class="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-all duration-200 flex justify-center items-center"
                        >
                            <UIcon name="i-lucide-list-video" class="size-8" />
                        </div>
                    </RouterLink>

                    <div class="pt-1">
                        <h2 class="font-bold text-md">{{ playlist.title }}</h2>
                        <p class="text-text-muted text-sm font-medium">{{ playlist.episodes }} Episodes</p>
                    </div>
                </div>
            </div>
        </Section>

        <Stats />
    </div>
</template>
