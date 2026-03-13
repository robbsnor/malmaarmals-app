<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, useTemplateRef } from 'vue';
import { usePlaylistsStore } from '../stores/playlists.store';
import type { Enums, Tables, TablesInsert, TablesUpdate } from '../../shared/models/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useScroll } from '@vueuse/core';
import type { Playlist } from '../models/playlist.model';

const props = defineProps<{
    playlist: Playlist;
}>();

const dialog = defineModel();
const playlistsStore = usePlaylistsStore();
const form = ref<TablesUpdate<'playlists'>>();
const valid = ref(false);
const loading = ref(false);

onMounted(() => {
    resetForm();
});

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

async function resetForm() {
    form.value = {
        id: props.playlist.id,
        title: props.playlist.title,
        description: props.playlist.description,
        order_type: props.playlist.order_type,
        order: props.playlist.order,
    };
}

async function updateExistingPlaylistOrder() {
    // const updates = playlistOrder.value
    //     .map((playlist, index) => ({
    //         id: playlist.id,
    //         order: index,
    //     }))
    //     .filter((item) => item.id);
    // const promises = updates.map(({ id, order }) => supabase.from('playlists').update({ order }).eq('id', id));
    // await Promise.all(promises);
}

async function submit() {
    loading.value = true;

    try {
        await updateExistingPlaylistOrder();

        const { error } = await supabase.from('playlists').update(form.value).eq('id', form.value.id);
        if (error) throw error;
        await sleep(500);
        await playlistsStore.fetchPlaylists();
        console.log('fajdfaj');
        dialog.value = false;
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Dialog v-model="dialog" title="Edit playlist" icon="mdi-pencil">
        <v-form v-model="valid" class="flex flex-col gap-4">
            <v-text-field label="Title" :rules="requiredRule" v-model="form.title"></v-text-field>
            <v-text-field label="Description" v-model="form.description"></v-text-field>
            <v-select
                :clearable="false"
                label="Video ordering"
                :rules="requiredRule"
                v-model="form.order_type"
                :items="orderTypeOptions"
            ></v-select>

            <v-number-input class="hidden!" v-model="form.order"></v-number-input>
        </v-form>

        <template #footer>
            <v-btn class="text-muted!" variant="text" @click="dialog = false"> cancel </v-btn>
            <v-btn color="primary" :loading="loading" variant="tonal" @click="submit"> Update </v-btn>
        </template>
    </Dialog>
</template>
