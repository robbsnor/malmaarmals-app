<script setup lang="ts">
import { computed, ref } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

const playlists = ref([
    {
        title: 'Peter VS Timon',
        episodes: 72,
        thumbnail: BucketHelper.getThumbnailUrl(2206408041),
    },
    {
        title: 'Teken streams',
        episodes: 3,
        thumbnail: BucketHelper.getThumbnailUrl(1732461290),
    },
    {
        title: 'LEKKERSPELEN ORIGINS',
        episodes: 4,
        thumbnail: BucketHelper.getThumbnailUrl(2170491752),
    },
    {
        title: 'Reclames kijken',
        episodes: 44,
        thumbnail: BucketHelper.getThumbnailUrl(1925255803),
    },
    {
        title: 'Resident Evil 7',
        episodes: 6,
        thumbnail: BucketHelper.getThumbnailUrl(1777474430),
    },
]);
</script>

<template>
    <Section title="Playlists" moreLink="/playlists">
        <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pt-4">
            <div
                v-for="playlist in playlists"
                :key="playlist.title"
                class="relative transition-all duration-200 rounded-md flex gap-4"
            >
                <div class="relative transition-all duration-200 group w-32 shrink-0">
                    <div
                        v-for="(thumbnail, i) in playlist.thumbnail"
                        :key="i"
                        class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none"
                        :src="thumbnail"
                        aria-hidden="true"
                        :class="[
                            i === 1 && '-top-4 scale-90 group-hover:-translate-y-2 bg-black-400',
                            i === 2 && '-top-2 scale-95 group-hover:-translate-y-1 bg-black-800',
                        ]"
                    ></div>

                    <VideoThumbnail :to="`/about`" :src="playlist.thumbnail" icon="mdi-playlist-play" />
                </div>

                <div>
                    <h2 class="font-bold text-md pt-2">{{ playlist.title }}</h2>
                    <p class="text-muted text-sm font-medium">{{ playlist.episodes }} Video's</p>
                </div>
            </div>
        </div>

        <template #actions>
            <v-btn to="/videos" variant="text">view all</v-btn>
        </template>
    </Section>
</template>
