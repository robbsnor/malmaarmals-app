<script setup lang="ts">
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistsStore = usePlaylistsStore();
</script>

<template>
    <Section title="Playlists" moreLink="/archive?type=playlists" moreText="All Playlists">
        <template v-if="playlistsStore.playlists.length">
            <div class="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" v-auto-animate>
                <template v-for="playlist in playlistsStore.playlists.slice(0, 10)" :key="playlist.id">
                    <PlaylistItem class="lg:hidden" :playlist="playlist" />

                    <PlaylistItemLarge class="max-lg:hidden" :playlist="playlist" />
                </template>
            </div>
        </template>

        <Empty v-else title="No playlists yet..." icon="mdi-format-list-bulleted" />
    </Section>
</template>
