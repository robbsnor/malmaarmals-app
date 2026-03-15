import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import { historyQuery, type Histories } from '../models/history.model';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<Histories>([]);
    const authStore = useAuthStore();

    async function fetchHistory() {
        const { data, error } = await historyQuery.limit(30);
        if (error) throw error;

        history.value = data;
    }

    async function deleteAll() {
        const { error } = await supabase.from('history').delete().neq('id', 'c1de8375-a19b-4ab9-ac47-053c751baaae'); // non existing video id
        if (error) throw error;

        await fetchHistory();
    }

    async function recordWatch(videoId: string, videoTime: number) {
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

        fetchHistory,
        deleteAll,
        recordWatch,
    };
});
