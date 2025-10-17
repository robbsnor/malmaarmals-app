<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import { supabase } from '../../../supabase';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';

const formDefault = {
    title: '',
    description: '',
    position: randomNumber(1, 300),
};

TitleHelper.setTitle('Playlists');

const playlistsStore = usePlaylistsStore();
const authStore = useAuthStore();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');
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

    const { error } = await supabase.from('playlists').insert({
        title: form.value.title,
        description: form.value.description,
        position: form.value.position,
    });

    loading.value = false;
    if (error) return;

    await playlistsStore.fetchPlaylists();
    form.value = { ...formDefault, position: randomNumber(1, 300) };
    sheet.value = false;
};
</script>

<template>
    <div class="py-4">
        <PlaylistItem v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
    </div>

    <div class="flex justify-center py-4">
        <v-btn
            v-if="authStore.isAdmin"
            variant="tonal"
            icon="mdi-plus"
            color="primary"
            size="x-small"
            @click="sheet = true"
        />
    </div>

    <v-bottom-sheet v-model="sheet" inset>
        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Create Playlist</div>
            <v-form v-model="valid">
                <v-text-field label="Title" :rules="rules" v-model="form.title"></v-text-field>
                <v-text-field label="Description" v-model="form.description"></v-text-field>
                <v-number-input label="Position" :rules="rules" v-model="form.position"></v-number-input>
                <v-btn color="primary" :disabled="!valid" :loading="loading" class="w-full" @click="submit">
                    Create
                </v-btn>
            </v-form>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
