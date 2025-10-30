<script setup lang="ts">
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useAppStore } from '../../shared/stores/app.store';
import { useRouter, RouterLink } from 'vue-router';
import { computed, ref } from 'vue';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { useVideoStore } from '../stores/video.store';
import type { Tables } from '../../shared/types/database.types';

const formDefault = {
    playlist_id: null,
};

const appStore = useAppStore();
const authStore = useAuthStore();
const playlistsStore = usePlaylistsStore();
const videostore = useVideoStore();
const sheet = ref(false);
const form = ref({ ...formDefault });
const valid = ref(false);
const loading = ref(false);
const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const submit = async () => {
    loading.value = true;

    const { error } = await supabase.from('playlist_videos').insert({
        playlist_id: form.value.playlist_id,
        video_id: videostore.videoInfo.id,
    });

    loading.value = false;
    if (error) return console.log(error);

    form.value = { ...formDefault };
    await playlistsStore.fetchPlaylists();
    sheet.value = false;
};
</script>

<template>
    <v-bottom-sheet v-model="sheet" inset>
        <template #activator="{ props }">
            <Auth>
                <v-icon v-bind="props" size="24" icon="mdi-plus" />
            </Auth>
        </template>

        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Add to playlist</div>
            <v-form v-model="valid" class="flex flex-col gap-4">
                <v-select
                    :rules="rules"
                    v-model="form.playlist_id"
                    label="Playlist"
                    item-title="title"
                    item-value="id"
                    :items="playlistsStore.playlists"
                />
                <v-btn
                    color="primary"
                    :disabled="!valid"
                    :loading="loading"
                    class="w-full"
                    @click="submit"
                    prepend-icon="mdi-plus"
                >
                    Add to playlist
                </v-btn>
            </v-form>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
