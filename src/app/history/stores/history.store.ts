import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { supabase } from '../../../supabase';
import { useVideoStore } from '../../video/stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideosStore } from '../../video/stores/videos.store';
import type { HistoryVideo } from '../../video/models/history-video.model';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<Tables<'history'>[]>([]);
    const videoStore = useVideoStore();
    const videosStore = useVideosStore();
    const authStore = useAuthStore();
    const videos = computed<HistoryVideo[]>(() => {
        return history.value.map((h) => {
            return {
                ...videosStore.videos.find((v) => v.id === h.video_id),
                watched_at: h.watched_at,
            };
        });
    });

    async function fetchHistory() {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('watched_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        history.value = data;
    }

    async function deleteAll() {
        const { error } = await supabase
            .from('history')
            .delete()
            .neq('video_id', 'c1de8375-a19b-4ab9-ac47-053c751baaae'); // non existing video id
        if (error) throw error;

        await fetchHistory();
    }

    async function add() {
        const videoId = videoStore.videoInfo.id;
        const userId = authStore.session?.user.id;
        if (!videoId || !userId) throw new Error('Missing videoId or userId');

        const { error, data } = await supabase.from('history').upsert(
            {
                video_id: videoId,
                watched_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,video_id' }
        );
        if (error) throw error;

        await fetchHistory();
    }

    return {
        history,
        videos,

        fetchHistory,
        deleteAll,
        add,
    };
});
