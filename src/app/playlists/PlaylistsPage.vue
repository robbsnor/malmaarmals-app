<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { usePlaylistsStore } from './stores/playlists.store';
import PlaylistItem from './components/PlaylistItem.vue';
import { supabase } from '../../supabase';

const formDefault = {
    title: '',
    description: '',
    position: 0,
};

TitleHelper.setTitle('Playlists');

const playlistsStore = usePlaylistsStore();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');
const sheet = ref(false);
const form = ref(formDefault);

const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const submit = async () => {
    console.log(form.value);
    const { data, error } = await supabase
        .from('playlists')
        .insert({
            title: form.value.title,
            description: form.value.description,
            position: form.value.position,
        })
        .select();

    if (error) return console.error(error);

    await playlistsStore.fetchPlaylists();
    form.value = formDefault;
    sheet.value = false;
};
</script>

<template>
    <Section title="Playlists">
        <template #actions>
            <v-btn icon="mdi-plus" color="primary" size="x-small" @click="sheet = true" />
        </template>

        <div class="flex justify-center gap-4 items-center pb-4">
            <v-text-field
                ref="searchRef"
                v-model="playlistsStore.query"
                :rounded="true"
                placeholder="Search..."
                density="comfortable"
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full"
            />
        </div>

        <div class="flex flex-col gap-8 pt-4">
            <PlaylistItem v-for="playlist in playlistsStore.playlists" :key="playlist.id" :playlist="playlist" />
        </div>
    </Section>

    <v-bottom-sheet v-model="sheet" inset>
        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Create Playlist</div>
            <v-form>
                <v-text-field label="Title" :rules="rules" v-model="form.title"></v-text-field>
                <v-text-field label="Description" v-model="form.description"></v-text-field>
                <v-number-input label="Position" :rules="rules" v-model="form.position"></v-number-input>
                <v-btn color="primary" class="w-full" @click="submit">Create</v-btn>
            </v-form>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
