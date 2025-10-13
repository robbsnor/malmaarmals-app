import { defineStore } from 'pinia';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { playlistsQuery, type Playlist, type Playlists } from '../models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';

export const usePlaylistsStore = defineStore('playlists', () => {
    const route = useRoute();
    const query = ref<string>('');
    const playlists = ref<Playlists>([]);

    const fetchPlaylists = async () => {
        const { data, error } = await playlistsQuery;

        const sorted = data.map((playlist) => {
            playlist.playlist_videos.sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
            return playlist;
        });

        playlists.value = sorted;
    };

    const getPlaylistById = (id: Ref<string>) => {
        return computed(() => {
            return playlists.value.find((p) => p.id === id.value);
        });
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
        // if (!query.value) return videos.value;
        // return videos.value.filter((video) => {
        //     const titleMatch = video.title.toLowerCase().includes(query.value.toLowerCase());
        //     const descriptionMatch =
        //         video.description && video.description.toLowerCase().includes(query.value.toLowerCase());
        //     const idMatch = video.video_id.toString().includes(query.value);
        //     return titleMatch || descriptionMatch || idMatch;
        // });
    });

    return {
        getPlaylistById,
        fetchPlaylists,
        deletePlaylist,
        playlists,
        filteredPlaylists,
        query,
    };
});
