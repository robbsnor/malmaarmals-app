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
const filterTypes = ['streams', 'playlists'] as const;

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
            <v-btn-toggle density="comfortable" variant="text" color="primary" v-model="archiveStore.activeFilterType">
                <v-btn v-for="type in filterTypes" :key="type" :value="type">
                    {{ type }}
                </v-btn>
            </v-btn-toggle>
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

        <div class="fixed bottom-mobile-navbar left-0 right-0 flex justify-center pb-4 z-1">
            <div class="bg-black-200 border border-black-400 rounded-full">
                <v-btn-toggle
                    density="comfortable"
                    rounded="xl"
                    variant="text"
                    class="rounded-full! overflow-hidden!"
                    color="primary"
                    v-model="archiveStore.activeFilterType"
                >
                    <v-btn v-for="type in filterTypes" :key="type" :value="type">
                        {{ type }}
                    </v-btn>
                </v-btn-toggle>
            </div>
        </div>
    </Section>
</template>
