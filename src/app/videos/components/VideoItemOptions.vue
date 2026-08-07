<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Video } from '../models/video.model';
import AddToPlaylistDialog from '../../playlists/components/AddToPlaylistDialog.vue';
import type { Playlist } from '../../playlists/models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { toast } from 'vue-sonner';
import { useClipboard } from '@vueuse/core';
import { useVideosStore } from '../stores/videos.store.ts';
import VideoItem from './VideoItem.vue';
import BlacklistDialog from './BlacklistDialog.vue';

const props = withDefaults(
    defineProps<{
        video: Video;
        playlist?: Playlist;
    }>(),
    {}
);

const playlistsStore = usePlaylistsStore();
const addDialog = ref(false);
const removeDialog = ref(false);
const blacklistDialog = ref(false);
const { copy } = useClipboard();

async function removeFromPlaylist() {
    try {
        const { error } = await supabase
            .from('playlist_videos')
            .delete()
            .eq('playlist_id', props.playlist.id)
            .eq('video_id', props.video.id);
        if (error) throw error;

        await playlistsStore.fetchPlaylists();
        toast.success('Successfully removed video');
        await sleep(5500);
    } finally {
        removeDialog.value = false;
    }
}

function copyId() {
    copy(props.video.video_id.toString());
    toast.success(`Copied video ID!`);
}
</script>

<template>
    <Admin>
        <v-menu location="bottom end">
            <template #activator="{ props }">
                <v-btn
                    @click.prevent.stop
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    class="shrink-0 text-muted!"
                    v-bind="props"
                />
            </template>

            <v-list>
                <AddToPlaylistDialog :video="video" v-model="addDialog">
                    <template #activator="activator">
                        <v-list-item v-if="!props.playlist" v-bind="activator.props" prepend-icon="mdi-playlist-plus">
                            Add to playlist
                        </v-list-item>
                    </template>
                </AddToPlaylistDialog>

                <v-list-item prepend-icon="mdi-content-copy" class="" @click="copyId"> Copy video ID </v-list-item>

                <DeleteDialog
                    v-model="removeDialog"
                    @confirm="removeFromPlaylist"
                    title="Remove video"
                    :description="`Are you sure you want to remove this video from the playlist?`"
                    :show-body="true"
                    confirmText="remove"
                >
                    <template #activator="activator">
                        <v-list-item
                            v-if="props.playlist"
                            v-bind="activator.props"
                            prepend-icon="mdi-playlist-remove"
                            class="text-red-500!"
                        >
                            Remove from playlist
                        </v-list-item>
                    </template>

                    <div class="p-4">
                        <VideoItem class="pointer-events-none" :video="props.video" :show-options="false" />
                    </div>
                </DeleteDialog>

                <v-list-item prepend-icon="mdi-cancel" class="text-red-500!" @click="blacklistDialog = true">
                    Blacklist video
                </v-list-item>
            </v-list>
        </v-menu>

        <BlacklistDialog v-model="blacklistDialog" :video="props.video" />
    </Admin>
</template>
