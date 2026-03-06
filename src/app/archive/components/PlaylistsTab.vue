<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';
import ManagePlaylist from './ManagePlaylist.vue';

TitleHelper.setTitle('playlists');

const playlistsStore = usePlaylistsStore();
const archiveStore = useArchiveStore();
</script>

<template>
    <FilterIndicator archiveType="PLAYLISTS" />

    <div v-auth class="flex justify-end items-center gap-4 bg-black-400 border border-black-600 p-2 mb-4 rounded-md">
        <ManagePlaylist />
    </div>

    <template v-if="playlistsStore.filteredPlaylists.length">
        <div class="flex flex-col gap-8 py-4 lg:hidden">
            <PlaylistItem
                v-for="playlist in playlistsStore.filteredPlaylists"
                :key="playlist.id"
                :playlist="playlist"
            />
        </div>

        <div class="grid gap-x-4 gap-y-8 grid-cols-6 xl:gap-8 max-lg:hidden">
            <PlaylistItemLarge v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
        </div>
    </template>

    <!-- empty -->
    <Empty
        v-if="!playlistsStore.filteredPlaylists.length && !archiveStore.query"
        title="No playlists yet..."
        icon="mdi-format-list-bulleted"
    />

    <!-- nothing found -->
    <Empty
        v-if="archiveStore.query && !playlistsStore.filteredPlaylists.length"
        :title="`No playlists found...`"
        icon="mdi-magnify"
        description="Try something else."
    >
        <v-btn @click="archiveStore.resetQuery">Clear</v-btn>
    </Empty>
</template>
