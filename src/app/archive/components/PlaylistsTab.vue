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
const { history, undo, redo, canUndo, reset } = useRefHistory(cloned);

async function cancel() {
    editMode.value = false;
    sync();
}

async function save() {
    loading.value = true;
    // save cloned to supabase
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

    <div v-auth class="flex justify-end items-center gap-4 bg-black-400 border border-black-600 p-2 mb-4 rounded-md">
        <v-btn v-if="editMode" prepend-icon="mdi-close" color="gray" variant="tonal" @click="cancel()"> cancel </v-btn>
        <v-btn
            v-if="editMode"
            prepend-icon="mdi-check"
            color="green"
            variant="tonal"
            @click="save()"
            :loading="loading"
        >
            save
        </v-btn>
        <v-btn v-if="!editMode" prepend-icon="mdi-pencil" color="primary" variant="tonal" @click="editMode = !editMode">
            Edit
        </v-btn>
        <ManagePlaylist />
    </div>

    <VueDraggable
        v-if="playlistsStore.playlists.length"
        :animation="200"
        :disabled="!editMode"
        class="flex flex-col gap-8 py-4 lg:hidden"
        handle=".handle"
        v-model="cloned"
    >
        <div v-for="playlist in playlists" :key="playlist.id" class="relative">
            <PlaylistItem :playlist="playlist" />
            <div
                v-if="editMode"
                class="absolute inset-0 -top-4 -bottom-4 bg-black/40 flex items-center justify-center rounded z-10"
            >
                <v-btn
                    icon="mdi-drag-horizontal-variant"
                    variant="tonal"
                    color="grey"
                    class="handle cursor-grab!"
                ></v-btn>
            </div>
        </div>
    </VueDraggable>

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
