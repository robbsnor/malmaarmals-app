<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { usePlaylistsStore } from './stores/playlists.store';
import PlaylistItem from './components/PlaylistItem.vue';

TitleHelper.setTitle('videos');

const playlistsStore = usePlaylistsStore();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');
</script>

<template>
    <Section title="Playlists">
        <div class="flex justify-center flex-col gap-4 items-center pb-4">
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
</template>
