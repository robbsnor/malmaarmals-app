import { defineStore } from 'pinia';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { playlistsQuery, type Playlists } from '../models/playlist.model';

export const usePlaylistsStore = defineStore('playlists', () => {
    const route = useRoute();
    const query = ref<string>('');
    const playlists = ref<Playlists>([]);

    onMounted(async () => {
        await fetchPlaylists();
    });

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
        playlists,
        filteredPlaylists,
        query,
    };
});
