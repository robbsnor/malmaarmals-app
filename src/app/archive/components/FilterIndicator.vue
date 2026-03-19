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
        const query = archiveStore.debouncedQuery?.toLowerCase();
        if (!query) return videosStore.populairCategories.length;

        return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query)).length;
    }
});
</script>

<template>
    <div v-if="archiveStore.query" class="pb-3 text-muted max-lg:hidden">
        <span>Filtering by: </span>
        <span class="text-primary font-bold">"{{ archiveStore.query }}" </span>
        <span
            >-
            {{ resultsOrigon }}
            result(s)
        </span>
        <v-btn
            variant="tonal"
            color="primary"
            size="small"
            class="ml-2"
            prepend-icon="mdi-close"
            @click="archiveStore.resetQuery()"
        >
            show all
        </v-btn>
    </div>
</template>
