<script setup lang="ts">
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import { computed, ref } from 'vue';
import { useCloned } from '@vueuse/core';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import _ from 'lodash';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

const playlistsStore = usePlaylistsStore();

const editMode = ref(false);
const dialog = ref(false);
const loading = ref(false);
const { cloned, sync } = useCloned(() => playlistsStore.playlists);
const hasChanges = computed(() => !_.isEqual(cloned.value, playlistsStore.playlists));

function onOpen() {
    sync();
}

async function cancel() {
    editMode.value = false;
    dialog.value = false;
}

async function save() {
    loading.value = true;

    const updates = cloned.value.map((playlist, index) => ({
        id: playlist.id,
        order: index,
    }));

    await sleep(500);
    const promises = updates.map(({ id, order }) => supabase.from('playlists').update({ order }).eq('id', id));
    await Promise.all(promises);
    await playlistsStore.fetchPlaylists();

    loading.value = false;
    editMode.value = false;
    dialog.value = false;
}
</script>

<template>
    <v-btn v-auth prepend-icon="mdi-pencil" color="primary" variant="tonal" class="flex-1" @click="dialog = true">
        Manage
    </v-btn>

    <Dialog v-model="dialog" title="Manage Playlists" @open="onOpen()">
        <VueDraggable
            v-if="playlistsStore.playlists.length"
            :animation="200"
            class="flex flex-col divide-black-600 divide-y -m-6"
            handle=".handle"
            v-model="cloned"
        >
            <div v-for="playlist in cloned" :key="playlist.id" class="relative flex items-center py-2">
                <v-btn
                    icon="mdi-drag-horizontal-variant"
                    variant="text"
                    size="small"
                    class="handle cursor-grab! text-muted! shrik-0"
                ></v-btn>

                <div class="flex items-center gap-4 flex-1">
                    <div class="w-18 rounded overflow-hidden">
                        <v-img :src="BucketHelper.getThumbnailUrl(playlist.videos[0]?.video_id)" alt="" />
                    </div>

                    <div>
                        <div class="font-bold text-muted">
                            {{ playlist.title }}
                        </div>

                        <div class="text-muted-more">{{ playlist.videos.length }} Video's</div>
                    </div>
                </div>

                <v-btn
                    icon="mdi-trash-can"
                    variant="text"
                    size="small"
                    class="handle cursor-grab! text-red-400! shrik-0 mr-2"
                ></v-btn>
            </div>
        </VueDraggable>

        <template #footer>
            <v-btn class="text-muted!" prepend-icon="mdi-close" variant="text" @click="cancel()"> cancel </v-btn>

            <v-btn
                prepend-icon="mdi-content-save"
                color="primary"
                variant="tonal"
                @click="save()"
                :loading="loading"
                :disabled="!hasChanges"
            >
                save
            </v-btn>
        </template>
    </Dialog>
</template>
