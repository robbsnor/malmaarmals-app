import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { supabase } from '../../../supabase';
import { useVideoStore } from './video.store';
import { useAuthStore } from '../../auth/stores/auth.store';

export const useHistoryStore = defineStore('history', () => {
    const history = ref<Tables<'history'>[]>([]);
    const videoStore = useVideoStore();
    const authStore = useAuthStore();

    const fetchHistory = async () => {
        const { data, error } = await supabase.from('history').select('*').order('watched_at', { ascending: false });
        if (error) throw error;

        history.value = data;
    };

    const save = async () => {
        console.log('Saving...');
        const videoId = videoStore.videoInfo.id;
        const userId = authStore.session?.user.id;
        if (!videoId || !userId) throw new Error('Missing videoId or userId');

        const { error } = await supabase.from('history').upsert(
            {
                video_id: videoId,
                watched_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,video_id' }
        );
        if (error) throw error;
    };

    return {
        fetchHistory,
        save,
    };
});
