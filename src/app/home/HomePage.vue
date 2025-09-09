<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import Stats from '../../app/home/components/Stats.vue';
import Video from '../app/../shared/components/Video.vue';
import LatestVideo from './components/LatestVideo.vue';
import { useAppStore } from '../shared/stores/app.store';

const appStore = useAppStore();
const { videos } = storeToRefs(appStore);

const number = ref(0);
const playlists = ref([
    {
        title: 'Peter VS Timon',
        episodes: 38,
        thumbnails: [
            'http://192.168.2.41:8000/thumbnails/2328589668',
            'http://192.168.2.41:8000/thumbnails/2230408125',
            'http://192.168.2.41:8000/thumbnails/2206408041',
        ],
    },
    {
        title: 'Straf Streams',
        episodes: 24,
        thumbnails: [
            'http://192.168.2.41:8000/thumbnails/1901294175',
            'http://192.168.2.41:8000/thumbnails/1888466252',
            'http://192.168.2.41:8000/thumbnails/1681133900',
        ],
    },
    {
        title: 'Astro Bot',
        episodes: 3,
        thumbnails: [
            'http://192.168.2.41:8000/thumbnails/2254460467',
            'http://192.168.2.41:8000/thumbnails/2254460467',
            'http://192.168.2.41:8000/thumbnails/2254460467',
        ],
    },
    {
        title: 'Mario Party',
        episodes: 2,
        thumbnails: [
            'http://192.168.2.41:8000/thumbnails/2328589668',
            'http://192.168.2.41:8000/thumbnails/2328589668',
            'http://192.168.2.41:8000/thumbnails/2328589668',
        ],
    },
    {
        title: 'Teken streams',
        episodes: 6,
        thumbnails: [
            'http://192.168.2.41:8000/thumbnails/2328589668',
            'http://192.168.2.41:8000/thumbnails/2328589668',
            'http://192.168.2.41:8000/thumbnails/2328589668',
        ],
    },
]);

const firstVideo = computed(() => videos?.value[number.value]);
const previousVideos = computed(() => videos?.value.slice(1, 6));

const handleArrow = (event: KeyboardEvent) => {
    if (!videos?.value) return;
    if (event.key === 'ArrowRight') {
        if (number.value < videos?.value.length - 1) {
            number.value++;
        }
    } else if (event.key === 'ArrowLeft') {
        if (number.value > 0) {
            number.value--;
        }
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleArrow);
});
</script>

<template>
    <div v-if="videos">
        <LatestVideo :video="firstVideo" />

        <Section title="Previous Streams">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in previousVideos" :key="video.video_id" :video="video" />
            </div>
        </Section>

        <Section title="Playlists">
            <div class="grid grid-cols-5 gap-8 pt-4">
                <div
                    v-for="playlist in playlists"
                    :key="playlist.title"
                    class="relative transition-all duration-200 rounded-md"
                >
                    <div class="relative transition-all duration-200 group">
                        <img
                            v-for="(thumbnail, i) in playlist.thumbnails"
                            :key="i"
                            class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none"
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

                        <VideoThumbnail
                            :to="`/about`"
                            :src="playlist.thumbnails[0]"
                            icon="i-lucide-list-video"
                            class="mb-2"
                        >
                        </VideoThumbnail>
                    </div>

                    <h2 class="font-bold text-md pt-2">{{ playlist.title }}</h2>
                    <p class="text-text-muted text-sm font-medium">{{ playlist.episodes }} Episodes</p>
                </div>
            </div>
        </Section>

        <Stats />

        <Section title="Populair Categories">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in previousVideos" :key="video.video_id" :video="video" />
            </div>
        </Section>
    </div>
</template>
