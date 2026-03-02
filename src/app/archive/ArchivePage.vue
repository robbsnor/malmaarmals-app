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
import Search from '../layout/components/Search.vue';

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<template>
    <Section :title="capitalizeFirstLetter(archiveStore.activeFilterType)">
        <template #actions>
            <div class="flex gap-2">
                <v-btn
                    :variant="archiveStore.activeFilterType === 'streams' ? 'tonal' : 'plain'"
                    :color="archiveStore.activeFilterType === 'streams' ? 'primary' : 'gray'"
                    v-model="archiveStore.activeFilterType"
                    @click="archiveStore.activeFilterType = 'streams'"
                >
                    streams
                </v-btn>
                <v-btn
                    :variant="archiveStore.activeFilterType === 'playlists' ? 'tonal' : 'plain'"
                    :color="archiveStore.activeFilterType === 'playlists' ? 'primary' : 'gray'"
                    v-model="archiveStore.activeFilterType"
                    @click="archiveStore.activeFilterType = 'playlists'"
                >
                    playlists
                </v-btn>
            </div>
            <!-- <v-tabs v-model="archiveStore.activeFilterType">
                <v-tab value="streams">streams</v-tab>
                <v-tab value="playlists">playlists</v-tab>
            </v-tabs> -->
        </template>

        <div class="lg:hidden! pb-4">
            <Search density="default" />
        </div>

        <div>
            <v-tabs-window v-model="archiveStore.activeFilterType">
                <v-tabs-window-item value="streams"><VideosTab /></v-tabs-window-item>
                <v-tabs-window-item value="playlists"><PlaylistsTab /></v-tabs-window-item>
            </v-tabs-window>
        </div>
    </Section>
</template>
