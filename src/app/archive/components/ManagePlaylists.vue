<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const playlistStore = usePlaylistsStore();

const dialog = ref(false);

function init() {}
</script>

<template>
    <v-btn v-auth prepend-icon="mdi-pencil" color="primary" @click="dialog = true">Manage</v-btn>

    <Dialog v-model="dialog" title="Manage Playlists" @open="init()">
        <div v-for="playlist in playlistStore.playlists">
            {{ playlist }}
        </div>
    </Dialog>
</template>
