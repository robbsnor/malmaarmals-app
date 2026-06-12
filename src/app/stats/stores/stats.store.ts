import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { Video } from '../../videos/models/video.model';
import { useVideosStore } from '../../videos/stores/videos.store';

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

        console.log(_years);

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

    return { videosByWeek, highestStreamPerWeek };
});
