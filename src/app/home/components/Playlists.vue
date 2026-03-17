<script setup lang="ts">
import { useDisplay } from 'vuetify';
import PlaylistItem from '../../playlists/components/PlaylistItem.vue';
import PlaylistItemLarge from '../../playlists/components/PlaylistItemLarge.vue';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { computed } from 'vue';

const playlistsStore = usePlaylistsStore();
const { lgAndUp, xlAndUp } = useDisplay();

const amount = computed(() => {
    if (xlAndUp.value) return 4;
    if (lgAndUp.value) return 4;

    return 5;
});
</script>

<template>
    <Section title="Playlists" moreLink="/archive?type=playlists" moreText="All Playlists">
        <template #actions>
            <div class="text-muted-more font-bold">{{ playlistsStore.playlists.length }} playlists</div>
        </template>

        <template v-if="playlistsStore.playlists.length">
            <div class="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4" v-auto-animate>
                <template v-for="playlist in playlistsStore.playlists.slice(0, amount)" :key="playlist.id">
                    <PlaylistItem class="lg:hidden" :playlist="playlist" />

                    <PlaylistItemLarge class="max-lg:hidden" :playlist="playlist" />
                </template>
            </div>
        </template>

        <Empty v-else title="No playlists yet..." icon="mdi-format-list-bulleted" />
    </Section>
</template>
