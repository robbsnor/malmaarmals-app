<script setup lang="ts">
import { computed, ref } from 'vue';
import { useArchiveStore } from '../stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const playlistsStore = usePlaylistsStore();

const props = defineProps<{
    archiveType: 'STREAMS' | 'PLAYLISTS';
}>();

const resultsOrigon = computed(() => {
    if (props.archiveType === 'STREAMS') {
        return videosStore.filteredVideos.length;
    } else if (props.archiveType === 'PLAYLISTS') {
        return playlistsStore.filteredPlaylists.length;
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
