<script setup lang="ts">
import { supabase } from '../../../supabase';
import { computed, ref } from 'vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import VideoItem from './VideoItem.vue';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';
import { sleep } from '../../shared/helpers/sleep';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import type { Playlist } from '../../playlists/models/playlist.model';

const props = defineProps<{ video: VideoWithChapters }>();

const playlistsStore = usePlaylistsStore();

const dialog = defineModel<boolean>();
const form = ref<{
    playlist: Playlist;
}>();
const valid = ref(false);
const loading = ref(false);
const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const playlists = computed(() =>
    playlistsStore.playlists.filter((p) => !p.videos.some((v) => v.id === props.video.id))
);

function onOpen() {
    resetForm();
}

function resetForm() {
    form.value = {
        playlist: null,
    };
}

const submit = async () => {
    try {
        loading.value = true;

        const { error } = await supabase.from('playlist_videos').insert({
            playlist_id: form.value.playlist.id,
            video_id: props.video.id,
        });
        if (error) throw error;

        await sleep(500);
        await playlistsStore.fetchPlaylists();
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
        dialog.value = false;
    }
};
</script>

<template>
    <Dialog v-model="dialog" inset title="Add to playlist" @open="onOpen()" :width="600">
        <div class="flex flex-col gap-8">
            <!-- <div class="pointer-events-none flex flex-col gap-2 items-center">
                <VideoItem :video="video" :show-options="false" class="w-full"></VideoItem>
                <v-icon v-if="form.playlist">mdi-arrow-down</v-icon>
                <PlaylistItem v-if="form.playlist" :playlist="form.playlist" class="w-full"></PlaylistItem>
            </div> -->

            <v-form v-model="valid" class="flex flex-col gap-4">
                <v-autocomplete
                    v-if="playlists"
                    :rules="rules"
                    v-model="form.playlist"
                    label="Playlist"
                    item-title="title"
                    autocomplete="off"
                    return-object
                    :items="playlists"
                >
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props">
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
            <v-btn variant="text" @click="dialog = false" class="text-muted!"> cancel </v-btn>
            <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit" variant="tonal">
                Add to playlist
            </v-btn>
        </template>
    </Dialog>
</template>
