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
const loading = ref(false);
const playlistStore = usePlaylistsStore();

const deletePlaylist = async () => {
    loading.value = true;
    const { error } = await playlistStore.deletePlaylist(props.playlist);

    if (!error) {
        dialog.value = false;
        router.push('/playlists');
    }

    loading.value = false;
};
</script>

<template>
    <Dialog v-model="dialog" title="Delete playlist?" icon="mdi-trash-can-outline" icon-color="error">
        <div>
            <div class="text-muted mb-2">Are you sure you want to delete the playlist:</div>
            <div class="font-bold">"{{ props.playlist.title }}"</div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
                <v-btn variant="tonal" :loading="loading" @click="deletePlaylist" color="error"> Delete </v-btn>
            </div>
        </template>
    </Dialog>
</template>
