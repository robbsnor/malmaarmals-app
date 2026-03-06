import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import { playlistsQuery, type Playlist, type Playlists } from '../models/playlist.model';
import { supabase } from '../../../supabase';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { PlaylistHelper } from '../helpers/playlist.helper';

export const usePlaylistsStore = defineStore('playlists', () => {
    const archiveStore = useArchiveStore();
    const playlists = ref<Playlists>([]);

    const fetchPlaylists = async () => {
        const { data, error } = await playlistsQuery.order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch playlists:', error);
            return;
        }

        playlists.value = PlaylistHelper.orderPlaylistsAndVideos(data);
    };

    function getPlaylistById(id: Ref<string>) {
        return computed(() => playlists.value.find((p) => p.id === id.value));
    }

    const deletePlaylist = async (id: string) => {
        const { error } = await supabase.from('playlists').delete().eq('id', id);
        if (!error) await fetchPlaylists();

        return error;
    };

    async function deleteVideoFromPlaylist(videoId: string, playlistId: string) {
        const { data, error } = await supabase
            .from('playlist_videos')
            .delete()
            .eq('playlist_id', playlistId)
            .eq('video_id', videoId);

        if (error) throw error;

        console.log('delete success');

        await fetchPlaylists();
    }

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
        deleteVideoFromPlaylist,

        playlists,
        filteredPlaylists,
    };
});
