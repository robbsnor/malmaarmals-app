<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useArchiveStore } from './stores/archive.store';
import VideosTab from './components/VideosTab.vue';
import PlaylistsTab from './components/PlaylistsTab.vue';
import { useRoute } from 'vue-router';
import AddOrEditPlaylistDialog from './components/AddOrEditPlaylistDialog.vue';
import ManagePlaylists from './components/ManagePlaylists.vue';
import { onStartTyping } from '@vueuse/core';
import Search from '../layout/components/Search.vue';

TitleHelper.setTitle('archive');

const archiveStore = useArchiveStore();
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

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<template>
    <Section :title="capitalizeFirstLetter(archiveStore.activeFilterType)">
        <template #actions>
            <div class="flex gap-4">
                <div v-visible="archiveStore.activeFilterType === 'playlists'" class="flex gap-2">
                    <ManagePlaylists />
                    <AddOrEditPlaylistDialog />
                </div>

                <div
                    v-auth
                    v-visible="archiveStore.activeFilterType === 'playlists'"
                    class="w-[1px] rounded-full bg-black-600 hidden lg:block"
                ></div>

                <div class="hidden lg:block">
                    <v-btn-toggle density="comfortable" color="primary" v-model="archiveStore.activeFilterType">
                        <v-btn value="streams">streams</v-btn>
                        <v-btn value="playlists">playlists</v-btn>
                    </v-btn-toggle>
                </div>
            </div>
        </template>

        <div class="lg:hidden">
            <Search density="default" />

            <v-tabs grow v-model="archiveStore.activeFilterType" color="primary">
                <v-tab value="streams">streams</v-tab>
                <v-tab value="playlists">playlists</v-tab>
            </v-tabs>
        </div>

        <div>
            <v-tabs-window v-model="archiveStore.activeFilterType">
                <v-tabs-window-item value="streams"><VideosTab /></v-tabs-window-item>
                <v-tabs-window-item value="playlists"><PlaylistsTab /></v-tabs-window-item>
            </v-tabs-window>
        </div>
    </Section>
</template>
