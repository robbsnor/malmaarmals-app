<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { computed, ref } from 'vue';
import { useCloned } from '@vueuse/core';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import _ from 'lodash';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

const playlistsStore = usePlaylistsStore();

const dialog = ref(false);
const loading = ref(false);
const { cloned, sync } = useCloned(() => playlistsStore.playlists);
const hasChanges = computed(() => !_.isEqual(cloned.value, playlistsStore.playlists));
const toDelete = computed(() => _.differenceBy(playlistsStore.playlists, cloned.value, 'id'));

function onOpen() {
    sync();
}

function remove(index: number) {
    cloned.value.splice(index, 1);
}

async function cancel() {
    dialog.value = false;
}

async function deletePlaylists() {
    const ids = toDelete.value.map((p) => p.id);
    await supabase.from('playlists').delete().in('id', ids);
}

async function reorderPlaylists() {
    const updates = cloned.value.map((playlist, index) => ({
        id: playlist.id,
        order: index,
    }));
    const promises = updates.map(({ id, order }) => supabase.from('playlists').update({ order }).eq('id', id));
    await Promise.all(promises);
}

async function save() {
    try {
        loading.value = true;

        await deletePlaylists();
        await reorderPlaylists();
        await sleep(500);
        await playlistsStore.fetchPlaylists();
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
        dialog.value = false;
    }
}
</script>

<template>
    <v-btn icon="mdi-pencil" class="rounded!" size="small" color="primary" variant="tonal" @click="dialog = true">
    </v-btn>

    <Dialog v-model="dialog" title="Manage Playlists" @open="onOpen()" :width="500" icon="mdi-pencil">
        <VueDraggable
            v-if="playlistsStore.playlists.length"
            :animation="200"
            class="flex flex-col divide-black-600 divide-y -m-4"
            handle=".handle"
            v-model="cloned"
        >
            <div v-for="(playlist, i) in cloned" :key="playlist.id" class="relative flex items-center py-2 px-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-18 rounded overflow-hidden aspect-video bg-black-400 shrink-0">
                        <v-img :src="BucketHelper.getThumbnailUrl(playlist.videos[0]?.video_id)" alt="" />
                    </div>

                    <div class="grow-0">
                        <div class="font-bold line-clamp-1">
                            {{ playlist.title }}
                        </div>

                        <div class="text-muted-more font-bold leading-tight">{{ playlist.videos.length }} Video's</div>
                    </div>
                </div>

                <div class="shrink-0 flex justify-center items-center gap-2 pr-0.5">
                    <v-btn
                        icon="mdi-trash-can"
                        variant="text"
                        size="small"
                        class="text-red-400! shrik-0"
                        @click="remove(i)"
                    ></v-btn>

                    <v-icon icon="mdi-drag" size="small" class="handle cursor-grab! text-muted! shrik-0"></v-icon>
                </div>
            </div>
        </VueDraggable>

        <template #footer>
            <div class="flex justify-between items-center gap-4 w-full">
                <div v-if="toDelete.length" class="italic text-muted text-sm">
                    {{ toDelete.length }} playlists deleted
                </div>

                <div class="flex gap-4 ml-auto">
                    <v-btn class="text-muted!" variant="text" @click="cancel()"> cancel </v-btn>

                    <v-btn color="primary" variant="tonal" @click="save()" :loading="loading" :disabled="!hasChanges">
                        save
                    </v-btn>
                </div>
            </div>
        </template>
    </Dialog>
</template>
