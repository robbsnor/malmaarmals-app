import { defineStore } from 'pinia';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { playlistsQuery, type Playlist, type Playlists } from '../models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useArchiveStore } from '../../archive/stores/archive.store';

export const usePlaylistsStore = defineStore('playlists', () => {
    const route = useRoute();
    const archiveStore = useArchiveStore();
    const playlists = ref<Playlists>([]);

    const fetchPlaylists = async () => {
        const { data, error } = await playlistsQuery;
        if (error) return console.log(error);

        const sorted = data.map((playlist) => {
            // order videos by recorded_at desc
            playlist.videos.sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));
            return playlist;
        });

        playlists.value = sorted;
    };

    const getPlaylistById = (id: Ref<string>) => {
        return playlists.value.find((p) => p.id === id.value);
    };

    const deletePlaylist = async (playlist: Playlist) => {
        await sleep(500);
        const { error } = await supabase.from('playlists').delete().eq('id', playlist.id);

        if (!error) {
            await fetchPlaylists();
        }

        return { error };
    };

    const filteredPlaylists = computed(() => {
        if (!archiveStore.query) return playlists.value;
        return playlists.value.filter((playlist) => {
            const titleMatch = playlist.title.toLowerCase().includes(archiveStore.query.toLowerCase());
            const descriptionMatch = playlist.description.toLowerCase().includes(archiveStore.query.toLowerCase());
            return titleMatch || descriptionMatch;
        });
    });

    return {
        getPlaylistById,
        fetchPlaylists,
        deletePlaylist,
        playlists,
        filteredPlaylists,
    };
});
