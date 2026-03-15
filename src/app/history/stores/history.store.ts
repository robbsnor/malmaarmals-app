import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import type { Tables } from '../../shared/models/database.types';
import { useVideosStore } from '../../video/stores/videos.store';
import type { HistoryVideo } from '../models/history-video.model';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<Tables<'history'>[]>([]);
    const authStore = useAuthStore();
    const videosStore = useVideosStore();

    const videos = computed<HistoryVideo[]>(() => {
        return history.value.map((history) => {
            return {
                ...videosStore.videos.find((v) => v.id === history.video_id),
                history: history,
            };
        });
    });

    async function fetchHistory() {
        const { data, error } = await supabase.from('history').select().order('watched_at', { ascending: false });
        if (error) throw error;

        history.value = data;
    }

    async function deleteAll() {
        const { error } = await supabase.from('history').delete().neq('id', 'c1de8375-a19b-4ab9-ac47-053c751baaae'); // non existing video id
        if (error) throw error;

        await fetchHistory();
    }

    async function recordWatch(videoId: string, videoTime: number) {
        if (videoTime === 0) return;

        console.log('Saving progression... ', videoId, videoTime);
        const { error } = await supabase.from('history').upsert(
            {
                user_id: authStore.session.user.id,
                video_id: videoId,
                video_time: videoTime,
                watched_at: new Date().toISOString(),
            },
            { onConflict: 'user_id, video_id' }
        );
        if (error) throw error;

        await fetchHistory();
    }

    return {
        history,
        videos,

        fetchHistory,
        deleteAll,
        recordWatch,
    };
});
