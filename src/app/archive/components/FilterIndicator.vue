<script setup lang="ts">
import { computed, ref } from 'vue';
import { useArchiveStore } from '../stores/archive.store';
import { useVideosStore } from '../../videos/stores/videos.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const playlistsStore = usePlaylistsStore();

const props = defineProps<{
    archiveType: 'STREAMS' | 'PLAYLISTS' | 'GAMES';
    totalResults?: number;
}>();

const resultsOrigon = computed(() => {
    if (props.totalResults !== undefined) {
        return props.totalResults;
    }

    if (props.archiveType === 'STREAMS') {
        return videosStore.filteredVideos.length;
    } else if (props.archiveType === 'PLAYLISTS') {
        return playlistsStore.filteredPlaylists.length;
    } else if (props.archiveType === 'GAMES') {
        const query = archiveStore.query?.toLowerCase();
        if (!query) return videosStore.populairCategories.length;

        return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query)).length;
    }
});
</script>

<template>
    <div v-if="archiveStore.query" class="pb-3">
        <span class="text-muted">Filtering by: </span>
        <span class="text-primary font-bold">"{{ archiveStore.query }}" </span>
        <span class="text-muted"
            >-
            {{ resultsOrigon }}
            result(s)</span
        >
    </div>
</template>
