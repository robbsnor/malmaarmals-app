<script setup lang="ts">
import { computed, nextTick, onBeforeMount, ref, useTemplateRef } from 'vue';
import { usePlaylistsStore } from '../stores/playlists.store';
import type { Enums, TablesInsert } from '../../shared/models/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useScroll } from '@vueuse/core';
import { toast } from 'vue-sonner';

type PlaylistOrderItem = {
    id?: string;
    title: string;
    image: string | null;
};

const emit = defineEmits<{
    success: [playlistId: string];
    error: [error: Error];
}>();

onBeforeMount(() => {
    resetForm();
});

const playlistsStore = usePlaylistsStore();
const form = ref<TablesInsert<'playlists'>>();
const valid = ref(false);
const loading = ref(false);
const playlistOrderRef = useTemplateRef<HTMLElement>('playlistOrderRef');
const { y } = useScroll(playlistOrderRef);

function scrollToBottom() {
    console.log(playlistOrderRef.value);
    y.value = playlistOrderRef.value.scrollHeight;
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

async function resetForm() {
    form.value = {
        title: '',
        description: '',
        order_type: 'date_ascending',
        order: 0,
    };

    form.value.order = playlistsStore.playlists.length;
    await nextTick();
    scrollToBottom();
}

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

        const { data, error } = await supabase.from('playlists').upsert(form.value).select('id').single();
        if (error) throw error;
        await sleep(500);
        await playlistsStore.fetchPlaylists();
        toast.success(`Playlist "${form.value.title}" created`);
        emit('success', data.id);
    } catch (error) {
        toast.error('Error creating playlist');
        emit('error', error as Error);
        throw error;
    } finally {
        loading.value = false;
    }
}

defineExpose({
    valid,
    loading,

    submit,
    resetForm,
});
</script>

<template>
    <v-form v-model="valid" class="flex flex-col gap-4">
        <v-text-field label="Title" :clearable="false" :rules="requiredRule" v-model="form.title"></v-text-field>
        <v-textarea label="Description" v-model="form.description" rows="1" auto-grow></v-textarea>
        <v-select
            :clearable="false"
            label="Video ordering"
            :rules="requiredRule"
            v-model="form.order_type"
            :items="orderTypeOptions"
        ></v-select>

        <v-number-input class="hidden!" v-model="form.order"></v-number-input>

        <div class="bg-black-600 rounded">
            <div class="p-4 pt-3 pb-1 opacity-70 border-b border-black-1000">Playlist order</div>

            <div
                v-auto-animate
                ref="playlistOrderRef"
                class="flex flex-col divide-y divide-black-800 py-2 max-h-60 lg:max-h-100 overflow-auto"
            >
                <div
                    v-for="(playlist, i) in playlistOrder"
                    :key="playlist.id"
                    class="flex gap-4 items-center py-2 px-4"
                    :class="playlist.id ?? 'bg-black-800'"
                >
                    <div class="w-20 aspect-video bg-black-500 rounded overflow-hidden shrink-0">
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
</template>
