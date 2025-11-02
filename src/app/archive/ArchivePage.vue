<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useArchiveStore } from './stores/archive.store';
import VideosTab from './components/VideosTab.vue';
import PlaylistsTab from './components/PlaylistsTab.vue';
import { useRoute } from 'vue-router';

TitleHelper.setTitle('Archive');

const archiveStore = useArchiveStore();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');
const route = useRoute();

onMounted(() => {
    document.getElementById('bottom-search')?.addEventListener('click', () => {
        if (route.path !== '/archive') return;
        searchRef.value?.focus();
    });
});
</script>

<template>
    <Container>
        <div class="fixed top-0 right-0 left-0 bg-black h-[128px] z-20 pt-4 px-4">
            <v-text-field
                ref="searchRef"
                v-model="archiveStore.query"
                :rounded="true"
                placeholder="Search..."
                density="comfortable"
                hide-details="auto"
                append-inner-icon="mdi-magnify"
                class="w-full"
            />

            <div class="pt-4">
                <v-tabs grow v-model="archiveStore.activeTab">
                    <v-tab value="streams">streams</v-tab>
                    <v-tab value="playlists">playlists</v-tab>
                    <v-tab value="categories">categories</v-tab>
                </v-tabs>
            </div>
        </div>

        <div class="pt-[128px]">
            <div class="py-4">
                <v-tabs-window v-model="archiveStore.activeTab">
                    <v-tabs-window-item value="streams"><VideosTab /></v-tabs-window-item>
                    <v-tabs-window-item value="playlists"><PlaylistsTab /></v-tabs-window-item>
                    <v-tabs-window-item value="categories"> categories </v-tabs-window-item>
                </v-tabs-window>
            </div>
        </div>
    </Container>
</template>
