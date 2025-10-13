<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { supabase } from '../../supabase';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';

TitleHelper.setTitle('videos');

const playlistStore = usePlaylistsStore();
const id = useRouteParams('id') as Ref<string>;
const playlist = playlistStore.getPlaylistById(id);
</script>

<template>
    <code>
        <pre>
            {{ playlist }}
        </pre>
    </code>
</template>
