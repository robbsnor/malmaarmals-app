import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../../../supabase';
import type { QueryData } from '@supabase/supabase-js';

const playlistsQuery = supabase.from('playlists').select('*, playlist_videos(video_id, videos(*))');
export type Playlists = QueryData<typeof playlistsQuery>;

export const usePlaylistsStore = defineStore('playlists', () => {
    const route = useRoute();
    const query = ref<string>('');
    const playlists = ref<Playlists>([]);

    onMounted(async () => {
        await fetchPlaylists();
    });

    const fetchPlaylists = async () => {
        const { data, error } = await playlistsQuery;

        playlists.value = data;
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
        playlists,
        filteredPlaylists,
        query,
    };
});
