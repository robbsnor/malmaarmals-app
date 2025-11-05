<script setup lang="ts">
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistsStore = usePlaylistsStore();
</script>

<template>
    <Section title="Playlists" moreLink="/archive?type=playlists" moreText="All Playlists">
        <div v-if="playlistsStore.playlists.length" class="flex flex-col gap-8 pt-4">
            <PlaylistItem
                v-for="playlist in playlistsStore.playlists.slice(0, 5)"
                :key="playlist.id"
                :playlist="playlist"
            />
        </div>

        <Empty v-else title="No playlists found." icon="mdi-format-list-bulleted" />
    </Section>
</template>
