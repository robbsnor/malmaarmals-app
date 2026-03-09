<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';
import ManagePlaylist from './ManagePlaylist.vue';
import ManagePlaylists from './ManagePlaylists.vue';
import { computed, ref, watch } from 'vue';
import { useCloned, useRefHistory } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import _ from 'lodash';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';

TitleHelper.setTitle('playlists');

const playlistsStore = usePlaylistsStore();
const archiveStore = useArchiveStore();
</script>

<template>
    <div class="max-lg:pt-2">
        <FilterIndicator archiveType="PLAYLISTS" />

        <div class="relative flex flex-col gap-4 lg:hidden">
            <PlaylistItem
                v-for="playlist in playlistsStore.filteredPlaylists"
                :key="playlist.id"
                :playlist="playlist"
            />
        </div>

        <div class="grid gap-x-4 gap-y-8 grid-cols-6 xl:gap-8 max-lg:hidden">
            <PlaylistItemLarge
                v-for="playlist in playlistsStore.filteredPlaylists"
                :key="playlist.id"
                :playlist="playlist"
            />
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
                <v-btn @click="archiveStore.resetQuery">Clear</v-btn>
                <ManagePlaylist></ManagePlaylist>
            </div>
        </Empty>
    </div>
</template>
