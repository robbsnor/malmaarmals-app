<script setup lang="ts">
import { supabase } from '../../../supabase';
import { computed, ref } from 'vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import VideoItem from './VideoItem.vue';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';
import { sleep } from '../../shared/helpers/sleep';
import type { TablesInsert } from '../../shared/models/database.types';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

const props = defineProps<{ video: VideoWithChapters }>();

const playlistsStore = usePlaylistsStore();
const sheet = ref(false);
const form = ref<TablesInsert<'playlist_videos'>>();
const valid = ref(false);
const loading = ref(false);
const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const selectedPlaylist = computed(() => playlistsStore.playlists.find((p) => p.id === form.value.playlist_id));

const playlistOptions = computed(() =>
    playlistsStore.playlists.map((p) => ({
        ...p,
        disabled: p.videos.some((v) => v.id === props.video.id),
    }))
);

function resetForm() {
    form.value = {
        playlist_id: null,
        video_id: null,
    };
}

function onOpen() {
    resetForm();
}

const submit = async () => {
    try {
        loading.value = true;

        const { error } = await supabase.from('playlist_videos').insert({
            playlist_id: form.value.playlist_id,
            video_id: props.video.id,
        });
        if (error) throw error;

        await sleep(500);
        await playlistsStore.fetchPlaylists();
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
        sheet.value = false;
    }
};
</script>

<template>
    <Drawer v-model="sheet" inset title="Add to playlist" @open="onOpen()">
        <template #activator="{ props }">
            <Auth>
                <slot name="activator" v-bind="{ props }"></slot>
            </Auth>
        </template>

        <div class="flex flex-col gap-8">
            <div class="pointer-events-none flex flex-col gap-2 items-center">
                <VideoItem :video="video" :show-options="false" class="w-full"></VideoItem>
                <v-icon v-if="selectedPlaylist">mdi-arrow-down</v-icon>
                <PlaylistItem v-if="selectedPlaylist" :playlist="selectedPlaylist" class="w-full"></PlaylistItem>
            </div>

            <v-form v-model="valid" class="flex flex-col gap-4">
                <v-autocomplete
                    :rules="rules"
                    v-model="form.playlist_id"
                    label="Playlist"
                    item-title="title"
                    autocomplete="off"
                    :items="playlistOptions"
                >
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props" :disabled="item.raw.disabled">
                            <template v-slot:prepend>
                                <div class="bg-black-200 rounded overflow-hidden w-18 aspect-video mr-4">
                                    <v-img :src="BucketHelper.getThumbnailUrl(item.raw.videos[0]?.video_id)" alt="" />
                                </div>
                            </template>
                        </v-list-item>
                    </template>
                </v-autocomplete>
            </v-form>
        </div>

        <template #footer>
            <v-btn variant="text" @click="sheet = false" class="text-muted!"> cancel </v-btn>
            <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit" variant="tonal">
                Add to playlist
            </v-btn>
        </template>
    </Drawer>
</template>
