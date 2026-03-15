<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';
import AddPlaylistDialog from '../../playlists/components/AddPlaylistDialog.vue';

TitleHelper.setTitle('playlists');

const playlistsStore = usePlaylistsStore();
const archiveStore = useArchiveStore();
</script>

<template>
    <div class="px-4 max-lg:pt-2">
        <FilterIndicator archiveType="PLAYLISTS" />

        <div class="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" v-auto-animate>
            <template v-for="playlist in playlistsStore.filteredPlaylists" :key="playlist.id">
                <PlaylistItem class="lg:hidden" :playlist="playlist" />

                <PlaylistItemLarge class="max-lg:hidden" :playlist="playlist" />
            </template>
        </div>

        <!-- empty -->
        <Empty
            v-if="!playlistsStore.filteredPlaylists.length && !archiveStore.query"
            title="No playlists yet..."
            icon="mdi-format-list-bulleted"
        />

        <!-- nothing found -->
        <Empty
            v-if="!playlistsStore.filteredPlaylists.length && archiveStore.query"
            :title="`No playlists found...`"
            icon="mdi-magnify"
            description="Try something else."
        >
            <div class="flex flex-col gap-4 items-center">
                <!-- <v-btn @click="archiveStore.resetQuery">Clear</v-btn> -->
                <AddPlaylistDialog />
            </div>
        </Empty>
    </div>
</template>
