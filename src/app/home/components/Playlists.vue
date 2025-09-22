<script setup lang="ts">
import { computed, ref } from 'vue';

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
</script>

<template>
    <Section title="Playlists">
        <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pt-4">
            <div
                v-for="playlist in playlists"
                :key="playlist.title"
                class="relative transition-all duration-200 rounded-md"
            >
                <div class="relative transition-all duration-200 group">
                    <div
                        v-for="(thumbnail, i) in playlist.thumbnails"
                        :key="i"
                        class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none"
                        :src="thumbnail"
                        aria-hidden="true"
                        :class="[
                            i === 1 ? '-top-4 scale-90  group-hover:-translate-y-2  bg-black-400' : '',
                            i === 2 ? '-top-2 scale-95  group-hover:-translate-y-1  bg-black-800' : '',
                        ]"
                    ></div>

                    <VideoThumbnail
                        :to="`/about`"
                        :src="playlist.thumbnails[0]"
                        icon="mdi-playlist-play"
                        class="mb-2"
                    />
                </div>

                <h2 class="font-bold text-md pt-2">{{ playlist.title }}</h2>
                <p class="text-text-muted text-sm font-medium">{{ playlist.episodes }} Episodes</p>
            </div>
        </div>
    </Section>
</template>
