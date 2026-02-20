<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useArchiveStore } from './stores/archive.store';
import VideosTab from './components/VideosTab.vue';
import PlaylistsTab from './components/PlaylistsTab.vue';
import { useRoute } from 'vue-router';
import { Z } from '../shared/directives/z.directive';
import { useVideosStore } from '../video/stores/videos.store';
import { onStartTyping } from '@vueuse/core';

TitleHelper.setTitle('archive');

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const searchRef = useTemplateRef<HTMLInputElement>('searchRef');
const route = useRoute();

onMounted(() => {
    archiveStore.setSearchEl(searchRef.value);

    document.getElementById('bottom-search')?.addEventListener('click', () => {
        if (route.path !== '/archive') return;
        searchRef.value.focus();
    });
});

onStartTyping(() => {
    searchRef.value.focus();
});
</script>

<template>
    <Container>
        <div class="py-4">
            <v-tabs-window v-model="archiveStore.activeFilterType">
                <v-tabs-window-item value="streams"><VideosTab /></v-tabs-window-item>
                <v-tabs-window-item value="playlists"><PlaylistsTab /></v-tabs-window-item>
                <!-- <v-tabs-window-item value="categories"> categories </v-tabs-window-item> -->
            </v-tabs-window>
        </div>
    </Container>
</template>
