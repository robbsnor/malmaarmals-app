<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Playlist } from '../models/playlist.model';
import { usePlaylistsStore } from '../stores/playlists.store';

const props = defineProps<{
    playlist: Playlist;
}>();
const router = useRouter();
const dialog = defineModel<boolean>();
const playlistStore = usePlaylistsStore();

const deletePlaylist = async () => {
    const { error } = await playlistStore.deletePlaylist(props.playlist);

    if (!error) {
        dialog.value = false;
        router.push({ name: 'archive' });
    }
};
</script>

<template>
    <DeleteDialog
        v-model="dialog"
        title="Delete playlist?"
        icon="mdi-trash-can-outline"
        icon-color="error"
        @confirm="deletePlaylist"
    >
        <div>
            <div class="text-muted mb-2">Are you sure you want to delete the playlist:</div>
            <div class="font-bold">"{{ props.playlist.title }}"</div>
        </div>
    </DeleteDialog>
</template>
