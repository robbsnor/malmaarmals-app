<script setup lang="ts">
import { computed, ref } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import PlaylistThumbnail from '../../playlists/components/PlaylistThumbnail.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistsStore = usePlaylistsStore();

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
    <Section title="Playlists" moreLink="/playlists" moreText="All Playlists">
        <div class="flex flex-col gap-8 pt-4">
            <PlaylistThumbnail v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
        </div>
    </Section>
</template>
