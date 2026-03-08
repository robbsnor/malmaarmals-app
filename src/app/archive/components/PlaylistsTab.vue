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

const editMode = ref(false);
const loading = ref(false);

const { cloned, sync } = useCloned(() => playlistsStore.playlists);
const playlists = computed(() => (editMode.value ? cloned.value : playlistsStore.filteredPlaylists));
const hasChanges = computed(() => !_.isEqual(cloned.value, playlistsStore.playlists));

async function cancel() {
    editMode.value = false;
    sync();
}

async function save() {
    loading.value = true;

    const updates = cloned.value.map((playlist, index) => ({
        id: playlist.id,
        order: index,
    }));

    const promises = updates.map(({ id, order }) => supabase.from('playlists').update({ order }).eq('id', id));
    await Promise.all(promises);
    await playlistsStore.fetchPlaylists();
    await sleep(500);

    loading.value = false;
    editMode.value = false;
    sync();
}
</script>

<template>
    <FilterIndicator archiveType="PLAYLISTS" />

    <div v-for="playlist in playlists" :key="playlist.id" class="relative py-2 lg:hidden">
        <PlaylistItem :playlist="playlist" />
    </div>

    <div class="grid gap-x-4 gap-y-8 grid-cols-6 xl:gap-8 max-lg:hidden">
        <PlaylistItemLarge v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
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
        <v-btn @click="archiveStore.resetQuery">Clear</v-btn>
    </Empty>
</template>
