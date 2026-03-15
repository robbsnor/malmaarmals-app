import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideosStore } from '../../video/stores/videos.store';
import type { HistoryWithVideo } from '../../video/models/history-video.model';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<HistoryWithVideo[]>([]);
    const videosStore = useVideosStore();
    const authStore = useAuthStore();

    async function fetchHistory() {
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .order('watched_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        history.value = data.map((h) => {
            return {
                ...h,
                video: videosStore.videos.find((v) => v.id === h.video_id),
            };
        });
    }

    async function deleteAll() {
        const { error } = await supabase.from('history').delete().neq('id', 'c1de8375-a19b-4ab9-ac47-053c751baaae'); // non existing video id
        if (error) throw error;

        await fetchHistory();
    }

    async function recordWatch(videoId: string, videoTime: number) {
        const { data, error } = await supabase
            .from('history')
            .upsert(
                {
                    user_id: authStore.session.user.id,
                    video_id: videoId,
                    video_time: videoTime,
                    watched_at: new Date().toISOString(),
                },
                { onConflict: 'user_id, video_id' }
            )
            .select()
            .single();

        if (error) throw error;

        console.log(data);

        // update local version
        const updatedHistory: HistoryWithVideo = {
            ...data,
            video: videosStore.videos.find((v) => v.id === data.video_id),
        };

        const index = history.value.findIndex((h) => h.video_id === videoId);
        if (index >= 0) {
            history.value[index] = updatedHistory;
        } else {
            history.value.unshift(updatedHistory);
        }
    }

    return {
        history,

        fetchHistory,
        deleteAll,
        recordWatch,
    };
});
