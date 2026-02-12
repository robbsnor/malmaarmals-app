import { defineStore } from 'pinia';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { playlistsQuery, type Playlist, type Playlists } from '../models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';

export const usePlaylistsStore = defineStore('playlists', () => {
    const videosStore = useVideosStore();
    const archiveStore = useArchiveStore();
    const playlists = ref<Playlists>([]);

    const fetchPlaylists = async () => {
        const { data, error } = await playlistsQuery.order('created_at', { ascending: false });
        if (error) return console.log(error);

        playlists.value = data;
    };

    const getPlaylistById = (id: Ref<string>) => {
        return playlists.value.find((p) => p.id === id.value);
    };

    const deletePlaylist = async (playlist: Playlist) => {
        const { error } = await supabase.from('playlists').delete().eq('id', playlist.id);
        if (!error) await fetchPlaylists();

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
