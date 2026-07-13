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

const props = withDefaults(
    defineProps<{
        video: Video;
        playlist?: Playlist;
    }>(),
    {}
);

const playlistsStore = usePlaylistsStore();
const videosStore = useVideosStore();
const addDialog = ref(false);
const removeDialog = ref(false);
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

async function blacklistVideo(id: number) {
    // remove from videos table
    const { error: delError } = await supabase.from('videos').delete().eq('video_id', id);
    if (delError) throw delError;

    // add id to blacklist table
    const { error: blError } = await supabase.from('videos_blacklist').insert({ video_id: id });
    if (blError) throw blError;

    // refetch videos
    await videosStore.fetchVideos();
}

function copyId() {
    copy(props.video.video_id.toString());
    toast.success(`Copied video ID!`);
}
</script>

<template>
    <Auth>
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

                <DeleteDialog
                    v-model="removeDialog"
                    @confirm="removeFromPlaylist"
                    title="Remove video?"
                    :description="`Are you sure you want to remove &quot;${props.video.title}&quot; from this playlist?`"
                    :show-body="false"
                    confirmText="remove"
                >
                    <template #activator="activator">
                        <v-list-item
                            v-if="props.playlist"
                            v-bind="activator.props"
                            prepend-icon="mdi-trash-can-outline"
                            class="text-red-500!"
                        >
                            Remove from playlist
                        </v-list-item>
                    </template>
                </DeleteDialog>

                <v-list-item prepend-icon="mdi-content-copy" class="" @click="copyId"> Copy video ID </v-list-item>
                <v-list-item
                    prepend-icon="mdi-trash-can-outline"
                    class="text-red-500!"
                    @click="blacklistVideo(props.video.video_id)"
                >
                    Blacklist video
                </v-list-item>
            </v-list>
        </v-menu>
    </Auth>
</template>
