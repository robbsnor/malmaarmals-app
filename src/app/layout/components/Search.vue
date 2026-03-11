<script setup lang="ts">
import { useArchiveStore } from '../../archive/stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const props = defineProps<{}>();

const updateQuery = (value: string | { id: string; title: string } | null) => {
    archiveStore.query = typeof value === 'string' ? value : value?.title;
};
</script>

<template>
    <v-combobox
        v-bind="props"
        :model-value="archiveStore.query"
        :items="videosStore.categoriesList"
        item-title="title"
        item-value="title"
        placeholder="Search..."
        hide-details
        clear-icon="mdi-close"
        menu-icon="mdi-chevron-down"
        autocomplete="off"
        class="search w-full"
        variant="solo"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        @update:model-value="updateQuery"
        @click:append-inner="archiveStore.query ? (archiveStore.query = '') : null"
    >
        <template #item="{ props, item }">
            <v-list-item v-bind="props">
                <template v-slot:prepend>
                    <div class="bg-black-400 rounded overflow-hidden w-8 aspect-[52/72] mr-4 my-1">
                        <v-img :src="`https://static-cdn.jtvnw.net/ttv-boxart/${item.raw.id}_IGDB-52x72.jpg`" alt="" />
                    </div>
                </template>
            </v-list-item>
        </template>
    </v-combobox>
</template>
