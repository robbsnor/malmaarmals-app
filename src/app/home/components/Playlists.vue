<script setup lang="ts">
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistsStore = usePlaylistsStore();
</script>

<template>
    <Section title="Playlists" moreLink="/playlists" moreText="All Playlists">
        <div class="flex flex-col gap-8 pt-4">
            <PlaylistItem v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
        </div>
    </Section>
</template>
