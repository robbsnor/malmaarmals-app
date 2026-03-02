<script setup lang="ts">
import { useArchiveStore } from '../../archive/stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const props = defineProps<{}>();
// const props = withDefaults(defineProps<{
//     items?: string;
// }>(), {
//     items: "test",
// });
</script>

<template>
    <v-combobox
        v-bind="props"
        v-model="archiveStore.query"
        :items="videosStore.categoriesList"
        placeholder="Search..."
        hide-details
        clear-icon="mdi-close"
        menu-icon="mdi-chevron-down"
        autocomplete="off"
        class="search w-full"
        variant="solo"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        @click:append-inner="archiveStore.query ? (archiveStore.query = '') : null"
    />
</template>
