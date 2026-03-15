<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../stores/playlists.store';
import { computed, ref, useTemplateRef } from 'vue';
import { useCloned, useElementSize, useRefHistory } from '@vueuse/core';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import _ from 'lodash';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { toast } from 'vue-sonner';

const playlistsStore = usePlaylistsStore();

const dialog = ref(false);
const loading = ref(false);
const { cloned, sync } = useCloned(() => playlistsStore.playlists);
const { history, canRedo, undo, redo, clear } = useRefHistory(cloned, {
    deep: true,
});
const hasChanges = computed(() => !_.isEqual(cloned.value, playlistsStore.playlists));
const toDelete = computed(() => _.differenceBy(playlistsStore.playlists, cloned.value, 'id'));

function onOpen() {
    sync();
    clear();
}

async function cancel() {
    dialog.value = false;
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

        await reorderPlaylists();
        await sleep(500);
        await playlistsStore.fetchPlaylists();
        toast.success('Playlists updated');
    } catch (error) {
        toast.error('Error updating playlists');
        throw error;
    } finally {
        loading.value = false;
        dialog.value = false;
    }
}
</script>

<template>
    <v-btn
        v-if="playlistsStore.playlists.length"
        v-auth
        icon="mdi-sort-variant"
        class="rounded!"
        size="small"
        color="primary"
        variant="tonal"
        @click="dialog = true"
    >
    </v-btn>

    <Dialog v-model="dialog" title="Change order" @open="onOpen()" icon="mdi-sort-variant">
        <VueDraggable
            v-if="playlistsStore.playlists.length"
            :animation="200"
            class="flex flex-col divide-black-600 divide-y -m-4"
            handle=".handle"
            v-model="cloned"
        >
            <div v-for="playlist in cloned" :key="playlist.id" class="relative flex items-center py-2 gap-4 px-4">
                <div class="flex items-center gap-4 flex-1">
                    <div class="w-18 rounded overflow-hidden aspect-video bg-black-400 shrink-0">
                        <v-img :src="BucketHelper.getThumbnailUrl(playlist.videos[0]?.video_id)" alt="" />
                    </div>

                    <div class="grow-1">
                        <div class="font-bold line-clamp-1 break-all">
                            {{ playlist.title }}
                        </div>

                        <div class="text-muted-more font-bold leading-tight">{{ playlist.videos.length }} Video's</div>
                    </div>
                </div>

                <div class="shrink-0 flex justify-center items-center gap-2 pr-0.5">
                    <v-icon icon="mdi-drag" size="small" class="handle cursor-grab! text-muted! shrik-0"></v-icon>
                </div>
            </div>
        </VueDraggable>

        <template #footer>
            <div class="flex justify-between items-center gap-4 w-full">
                <div class="flex gap-4 items-center">
                    <v-btn
                        :disabled="!hasChanges"
                        @click="undo()"
                        icon="mdi-undo"
                        variant="tonal"
                        class="rounded!"
                        color="gau"
                        size="small"
                    ></v-btn>
                    <v-btn
                        :disabled="!canRedo"
                        @click="redo()"
                        icon="mdi-redo"
                        variant="tonal"
                        class="rounded!"
                        color="gau"
                        size="small"
                    ></v-btn>
                    <!-- <div v-if="toDelete.length" class="italic text-muted text-sm">
                        {{ toDelete.length }} playlist(s) deleted
                    </div> -->
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
