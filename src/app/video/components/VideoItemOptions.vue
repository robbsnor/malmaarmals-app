<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';
import AddToPlaylistDialog from '../../playlists/components/AddToPlaylistDialog.vue';
import type { Playlist } from '../../playlists/models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const props = withDefaults(
    defineProps<{
        video: VideoWithChapters;
        playlist?: Playlist;
    }>(),
    {}
);

const playlistsStore = usePlaylistsStore();
const addDialog = ref(false);
const removeDialog = ref(false);

async function removeFromPlaylist() {
    try {
        console.log('owwow');
        const { error } = await supabase
            .from('playlist_videos')
            .delete()
            .eq('playlist_id', props.playlist.id)
            .eq('video_id', props.video.id);
        if (error) throw error;

        await playlistsStore.fetchPlaylists();
        await sleep(5500);
    } finally {
        removeDialog.value = false;
    }
}
</script>

<template>
    <div v-auth>
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
            </v-list>
        </v-menu>
    </div>
</template>
