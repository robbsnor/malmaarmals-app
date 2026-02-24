<script setup lang="ts">
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistsStore = usePlaylistsStore();
</script>

<template>
    <Section title="Playlists" moreLink="/archive?type=playlists" moreText="All Playlists">
        <template v-if="playlistsStore.playlists.length">
            <div class="flex flex-col gap-8 pt-4 lg:hidden">
                <PlaylistItem
                    v-for="playlist in playlistsStore.playlists.slice(0, 5)"
                    :key="playlist.id"
                    :playlist="playlist"
                />
            </div>

            <div class="grid gap-x-4 gap-y-8 grid-cols-4 xl:gap-8 max-lg:hidden">
                <PlaylistItemLarge
                    v-for="playlist in playlistsStore.playlists.slice(0, 8)"
                    :key="playlist.id"
                    :playlist="playlist"
                />
            </div>
        </template>

        <Empty v-else title="No playlists yet..." icon="mdi-format-list-bulleted" />
    </Section>
</template>
