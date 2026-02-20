<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { onStartTyping } from '@vueuse/core';
import { useArchiveStore } from '../stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const searchRef = useTemplateRef<HTMLElement | any>('searchRef');

onStartTyping(() => searchRef.value?.$el?.querySelector('input').focus());
</script>

<template>
    <div class="flex items-center h-screen max-h-[30vh] relative">
        <Container class="relative z-1">
            <div class="flex items-center justify-center py-12 flex-col gap-2 pb-8">
                <Logo payoff />

                <div class="pt-4 flex gap-4">
                    <v-combobox
                        ref="searchRef"
                        v-model="archiveStore.query"
                        :items="videosStore.categoriesList"
                        placeholder="Search..."
                        hide-details
                        clear-icon="mdi-close"
                        menu-icon="mdi-chevron-down"
                        autocomplete="off"
                        class="search w-110"
                        variant="solo"
                        prepend-inner-icon="mdi-magnify"
                        @click:append-inner="archiveStore.query ? (archiveStore.query = '') : null"
                    />
                </div>

                <v-tabs grow v-model="archiveStore.activeFilterType">
                    <v-tab value="streams">streams</v-tab>
                    <v-tab value="playlists">playlists</v-tab>
                    <!-- <v-tab value="categories">categories</v-tab> -->
                </v-tabs>
            </div>
        </Container>

        <div
            class="absolute inset-0 pointer-events-none bg-center bg-[url('/images/sicko.svg')] bg-repeat bg-[length:120px_auto] [filter:invert(0.9)] animate-slide"
        ></div>
        <div
            class="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black-100 from-10% pointer-events-none"
        ></div>
    </div>
</template>

<style scoped>
@keyframes slide {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 120px 120px;
    }
}

.animate-slide {
    animation: slide 20s linear infinite;
}
</style>
