<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { useArchiveStore } from '../stores/archive.store';
import FilterIndicator from './FilterIndicator.vue';
import AddOrEditPlaylistDialog from '../../playlists/components/AddOrEditPlaylistDialog.vue';
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

        <div class="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" v-auto-animate>
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
                <AddOrEditPlaylistDialog />
            </div>
        </Empty>
    </div>
</template>
