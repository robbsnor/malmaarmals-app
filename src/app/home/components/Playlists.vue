<script setup lang="ts">
import { useDisplay } from 'vuetify';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { computed } from 'vue';

const playlistsStore = usePlaylistsStore();
const { xlAndUp, mdAndUp } = useDisplay();

const amount = computed(() => {
    if (xlAndUp.value) return 8;
    if (mdAndUp.value) return 6;

    return 5;
});
</script>

<template>
    <Section title="Playlists" :more-link="{ name: 'playlists' }" moreText="All Playlists">
        <template #actions>
            <div class="text-muted-more font-bold">{{ playlistsStore.playlists.length }} playlists</div>
        </template>

        <template v-if="playlistsStore.playlists.length">
            <div
                class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
                v-auto-animate
            >
                <template v-for="playlist in playlistsStore.playlists.slice(0, amount)" :key="playlist.id">
                    <PlaylistItem class="md:hidden" :playlist="playlist" />
                    <PlaylistItemLarge class="max-md:hidden" :playlist="playlist" />
                </template>
            </div>
        </template>

        <Empty v-else title="No playlists yet..." icon="mdi-format-list-bulleted" />
    </Section>
</template>
