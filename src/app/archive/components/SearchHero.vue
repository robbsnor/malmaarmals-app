<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { onStartTyping, useDevicesList } from '@vueuse/core';
import { useArchiveStore } from '../stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const searchRef = useTemplateRef<HTMLElement | any>('searchRef');
const route = useRoute();

const { lgAndUp, mdAndUp } = useDisplay();

onStartTyping(() => searchRef.value?.$el?.querySelector('input').focus());
</script>

<template>
    <div
        class="flex items-center relative bg-black pt-12 lg:pt-12 lg:pb-6"
        :class="{ 'hidden! lg:flex!': route.name === 'home' }"
    >
        <Container class="relative z-1">
            <!-- <div class="absolute top-2 right-2">
                <v-btn
                    variant="text"
                    color="red"
                    href="https://www.twitch.tv/lekkerspelen"
                    target="_blank"
                    class="flex gap-2 items-center justify-center"
                >
                    <div class="flex justify-center items-center gap-2">
                        <div class="relative flex justify-center items-center">
                            <div class="size-2 bg-red-500 rounded-full absolute animate-ping duration-[3000ms]!"></div>
                            <div class="size-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div>Live</div>
                    </div>
                </v-btn>
            </div> -->

            <div class="flex items-center justify-center flex-col gap-2">
                <Logo payoff />

                <div class="pt-4 flex gap-4 grow w-full max-w-160">
                    <v-combobox
                        ref="searchRef"
                        v-model="archiveStore.query"
                        :items="videosStore.categoriesList"
                        placeholder="Search..."
                        hide-details
                        clear-icon="mdi-close"
                        menu-icon="mdi-chevron-down"
                        autocomplete="off"
                        class="w-full"
                        density="default"
                        variant="solo"
                        prepend-inner-icon="mdi-magnify"
                        @click:append-inner="archiveStore.query ? (archiveStore.query = '') : null"
                    />
                </div>

                <div
                    :class="{ 'opacity-0 pointer-events-none': !route.meta.showTabs }"
                    class="transition-all w-full flex justify-center"
                >
                    <v-tabs v-model="archiveStore.activeFilterType" :grow="!mdAndUp">
                        <v-tab value="streams">streams</v-tab>
                        <v-tab value="playlists">playlists</v-tab>
                    </v-tabs>
                </div>
            </div>
        </Container>

        <div
            class="absolute inset-0 pointer-events-none bg-[url('/images/sicko.svg')] bg-repeat bg-[length:120px_auto] [filter:invert(0.85)] transition-all animate-slide"
        ></div>
        <div
            class="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black-100 from-10% pointer-events-none bg-red-500f"
        ></div>
    </div>
</template>

<style scoped>
@keyframes slide {
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 1000px 1000px;
    }
}

.animate-slide {
    animation: slide 100s linear infinite;
}
</style>
