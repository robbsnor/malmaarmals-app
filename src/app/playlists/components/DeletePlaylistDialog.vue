<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Playlist } from '../models/playlist.model';
import { usePlaylistsStore } from '../stores/playlists.store';
import { toast } from 'vue-sonner';

const props = defineProps<{
    playlist: Playlist;
}>();
const router = useRouter();
const dialog = defineModel<boolean>();
const playlistStore = usePlaylistsStore();

const deletePlaylist = async () => {
    const error = await playlistStore.deletePlaylist(props.playlist.id);

    if (!error) {
        dialog.value = false;
        router.push({ name: 'playlists' });
        toast.success('Playlist deleted');
    }
};
</script>

<template>
    <DeleteDialog
        v-model="dialog"
        title="Delete playlist?"
        :description="`Are you sure you want to delte: ${props.playlist.title}`"
        icon="mdi-trash-can-outline"
        icon-color="error"
        :show-body="false"
        @confirm="deletePlaylist"
    >
    </DeleteDialog>
</template>
