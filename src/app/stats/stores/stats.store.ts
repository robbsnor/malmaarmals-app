import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { Video } from '../../videos/models/video.model';
import { useVideosStore } from '../../videos/stores/videos.store';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/models/database.types';
import { useAuthStore } from '../../auth/stores/auth.store';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface Year {
    year: number;
    months: Month[];
}

export interface Month {
    month: string;
    weeks: Video[][];
}

export const useStatsStore = defineStore('stats', () => {
    const videosStore = useVideosStore();
    const authStore = useAuthStore();
    const chatStatsLoading = ref(true);
    const chatStats = ref();
    const historyStats = ref<Tables<'history'>[]>([]);

    onMounted(async () => {
        getHistoryStats();
        const { data, error } = await supabase.rpc('get_stats').select();

        if (error) {
            chatStatsLoading.value = false;
            throw error;
        }

        chatStatsLoading.value = false;
        chatStats.value = data;
    });

    async function getHistoryStats() {
        if (!authStore.isAdmin) return;

        const { data, error } = await supabase.functions.invoke('history-stats');
        if (error) throw console.error('Error calling function:', error);

        historyStats.value = data;
    }

    const videosByWeek = computed(() => {
        const _years: Year[] = [];

        videosStore.videos.forEach((video) => {
            const date = new Date(video.recorded_at);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'short' });
            const week = getWeekOfMonth(date);

            let yearEntry = _years.find((y) => y.year === year);
            if (!yearEntry) {
                yearEntry = {
                    year: year,
                    months: monthNames.map((month) => ({
                        month,
                        weeks: Array.from({ length: 4 }, () => []),
                    })),
                };

                _years.push(yearEntry);
            }

            const monthEntry = yearEntry.months.find((m) => m.month === month);

            monthEntry.weeks[week].push(video);
        });

        return _years;
    });

    const highestStreamPerWeek = computed(() =>
        Math.max(
            ...videosByWeek.value.flatMap((year) =>
                year.months.flatMap((month) => month.weeks.map((week) => week.length))
            )
        )
    );

    function getWeekOfMonth(date: Date): number {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return Math.min(Math.floor((date.getDate() + firstDay - 1) / 7), 3);
    }

    return {
        chatStatsLoading,
        chatStats,

        videosByWeek,
        highestStreamPerWeek,
        historyStats,
    };
});
