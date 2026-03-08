<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { supabase } from '../../../supabase';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import type { Enums, TablesInsert } from '../../shared/models/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { sleep } from '../../shared/helpers/sleep';

type PlaylistOrderItem = {
    id?: string;
    title: string;
    image: string | null;
};

const createDefaultForm = (): TablesInsert<'playlists'> => ({
    title: '',
    description: '',
    order_type: 'date_descending',
    order: 0,
});

const playlistsStore = usePlaylistsStore();

const sheet = ref(false);
const form = ref<TablesInsert<'playlists'>>(createDefaultForm());
const valid = ref(false);
const loading = ref(false);

const requiredRule = [
    (value: string | number | null) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const orderTypeOptions: Array<{ title: string; value: Enums<'playlist_order_type'> }> = [
    { title: 'Oldest video first', value: 'date_ascending' },
    { title: 'Newest video first', value: 'date_descending' },
    { title: 'Custom', value: 'custom' },
];

const playlistOrder = computed<PlaylistOrderItem[]>(() => {
    const order: PlaylistOrderItem[] = playlistsStore.playlists.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        image: playlist.videos[0] ? BucketHelper.getThumbnailUrl(playlist.videos[0].video_id) : null,
    }));

    order.splice(form.value.order, 0, {
        title: form.value.title || '...',
        image: null,
    });

    return order;
});

function addBelow(index: number) {
    let targetorder = index;

    if (index < form.value.order) {
        targetorder = index + 1;
    }

    form.value.order = targetorder;
}

async function updateExistingPlaylistOrder() {
    const updates = playlistOrder.value
        .map((playlist, index) => ({
            id: playlist.id,
            order: index,
        }))
        .filter((item) => item.id);

    const promises = updates.map(({ id, order }) => supabase.from('playlists').update({ order }).eq('id', id));
    await Promise.all(promises);
}

async function submit() {
    loading.value = true;

    try {
        await updateExistingPlaylistOrder();

        await supabase.from('playlists').upsert(form.value);
        await sleep(500);
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
        form.value = createDefaultForm();

        sheet.value = false;
    }

    await playlistsStore.fetchPlaylists();
}
</script>

<template>
    <v-btn icon="mdi-plus" class="rounded!" size="small" color="primary" variant="tonal" @click="sheet = true"> </v-btn>

    <Dialog v-model="sheet" inset title="Create Playlist">
        <v-form v-model="valid" class="flex flex-col gap-4">
            <v-text-field label="Title" :rules="requiredRule" v-model="form.title"></v-text-field>
            <v-text-field label="Description" v-model="form.description"></v-text-field>
            <v-select
                :clearable="false"
                label="Video ordering"
                v-model="form.order_type"
                :items="orderTypeOptions"
            ></v-select>

            <v-number-input class="hidden!" v-model="form.order"></v-number-input>

            <div class="bg-black-600 rounded">
                <div class="p-4 pb-1 opacity-70">Playlist order</div>

                <div
                    v-auto-animate
                    class="flex flex-col divide-y divide-black-800 py-2 lg:max-h-100 overflow-auto rounded"
                >
                    <div
                        v-for="(playlist, i) in playlistOrder"
                        :key="playlist.id"
                        class="flex gap-2 items-center py-2 px-4"
                        :class="playlist.id || 'bg-black-800'"
                    >
                        <div class="w-20 aspect-video bg-black-500 rounded overflow-hidden">
                            <v-img v-if="playlist.image" :src="playlist.image" alt="" />
                        </div>
                        <div class="font-bold">{{ playlist.title }}</div>

                        <div class="ml-auto flex gap-2">
                            <v-btn
                                v-if="playlist.id"
                                variant="tonal"
                                color="primary"
                                class="rounded-md!"
                                icon="mdi-arrow-left-bottom"
                                size="small"
                                @click="addBelow(i)"
                            ></v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </v-form>

        <template #footer>
            <v-btn class="text-muted!" variant="text" @click="sheet = false"> cancel </v-btn>
            <v-btn color="primary" :disabled="!valid" variant="tonal" :loading="loading" @click="submit">
                Create
            </v-btn>
        </template>
    </Dialog>
</template>
