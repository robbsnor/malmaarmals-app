<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, useTemplateRef } from 'vue';
import { usePlaylistsStore } from '../stores/playlists.store';
import type { Enums, Tables, TablesInsert, TablesUpdate } from '../../shared/models/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useCloned, useScroll } from '@vueuse/core';
import type { Playlist } from '../models/playlist.model';
import { toast } from 'vue-sonner';

const props = defineProps<{
    playlist: Playlist;
}>();

const dialog = defineModel();
const playlistsStore = usePlaylistsStore();
const valid = ref(false);
const loading = ref(false);
const { cloned: playlist, sync, isModified } = useCloned(() => props.playlist);

function onOpen() {
    console.log('opened');
    sync();
}

const requiredRule = [
    (value: string | number | null) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const orderTypeOptions: Array<{ title: string; value: Enums<'playlist_order_type'> }> = [
    { title: 'Oldest video first', value: 'date_ascending' },
    { title: 'Newest video first', value: 'date_descending' },
];

async function submit() {
    loading.value = true;

    try {
        const { error } = await supabase
            .from('playlists')
            .update({
                id: playlist.value.id,
                title: playlist.value.title,
                description: playlist.value.description,
                order_type: playlist.value.order_type,
                order: playlist.value.order,
            })
            .eq('id', playlist.value.id);

        if (error) throw error;

        await sleep(500);
        await playlistsStore.fetchPlaylists();
        dialog.value = false;

        toast.success('Saved successfully');
    } catch (error) {
        toast.error('Error updating playlist');
        throw error;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Dialog v-model="dialog" title="Edit playlist" icon="mdi-pencil" @open="onOpen()">
        <v-form v-model="valid" class="flex flex-col gap-4">
            <v-text-field label="Title" :rules="requiredRule" v-model="playlist.title"></v-text-field>
            <v-textarea label="Description" v-model="playlist.description" rows="1" auto-grow></v-textarea>
            <v-select
                :clearable="false"
                label="Video ordering"
                :rules="requiredRule"
                v-model="playlist.order_type"
                :items="orderTypeOptions"
            ></v-select>

            <v-number-input class="hidden!" v-model="playlist.order"></v-number-input>
        </v-form>

        <template #footer>
            <v-btn class="text-muted!" variant="text" @click="dialog = false"> cancel </v-btn>
            <v-btn color="primary" :loading="loading" variant="tonal" @click="submit" :disabled="!isModified">
                Update
            </v-btn>
        </template>
    </Dialog>
</template>
