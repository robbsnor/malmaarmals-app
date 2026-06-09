<script setup lang="ts">
import { computed } from 'vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { BucketHelper } from '../helpers/bucket.helper';
import type { Video } from '../../videos/models/video.model';

const videosStore = useVideosStore();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthOverview {
    monthName: string;
    monthIndex: number;
    streams: Video[];
}

interface YearOverview {
    year: number;
    months: MonthOverview[];
    totalStreams: number;
}

const years = computed<YearOverview[]>(() => {
    const yearMap = new Map<number, YearOverview>();

    videosStore.videos.forEach((video) => {
        const date = new Date(video.recorded_at);
        if (Number.isNaN(date.getTime())) return;

        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        let yearEntry = yearMap.get(year);

        if (!yearEntry) {
            yearEntry = {
                year,
                months: monthNames.map((name, index) => ({ monthName: name, monthIndex: index, streams: [] })),
                totalStreams: 0,
            };
            yearMap.set(year, yearEntry);
        }

        yearEntry.months[monthIndex].streams.push(video);
        yearEntry.totalStreams += 1;
    });

    return Array.from(yearMap.values()).sort((a, b) => b.year - a.year);
});

const totalHoursStreamed = computed(() =>
    Math.round(videosStore.videos.reduce((prev, cur) => prev + cur.length_sec, 0) / 3600)
);

const monthColorClass = (count: number) => {
    if (count >= 16) return 'bg-[#1ad339]';
    if (count >= 10) return 'bg-[#56d364]';
    if (count >= 8) return 'bg-[#2ea043]';
    if (count >= 4) return 'bg-[#033a16]';
    if (count >= 1) return 'bg-[#196c2e]';

    return 'bg-black-400';
};
const isCurrentMonth = (year: number, monthIndex: number) => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === monthIndex;
};
</script>

<template>
    <Auth>
        <Section title="Stream history" description="Monthly activity grouped by year" width="800px">
            <div class="space-y-6">
                <div v-for="year in years" :key="year.year" class="space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="text-base font-semibold">{{ year.year }}</div>
                        <div class="text-xs text-slate-400">{{ year.totalStreams }} streams</div>
                    </div>

                    <div class="grid grid-cols-6 sm:grid-cols-12 gap-2 justify-start">
                        <button
                            v-for="month in year.months.slice().reverse()"
                            :key="month.monthIndex"
                            class="text-center"
                        >
                            <v-menu location="top" max-width="420">
                                <template #activator="{ props }">
                                    <div v-bind="props">
                                        <div
                                            class="w-full aspect-square rounded transition duration-150 hover:brightness-125"
                                            :class="[
                                                monthColorClass(month.streams.length),
                                                isCurrentMonth(year.year, month.monthIndex) &&
                                                    'ring-2 ring-[gold] ring-offset-1 ring-offset-black pulse-ring',
                                            ]"
                                            :title="`${month.monthName}: ${month.streams.length} stream${month.streams.length === 1 ? '' : 's'}`"
                                        ></div>

                                        <div class="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                                            {{ month.monthName }}
                                        </div>
                                    </div>
                                </template>

                                <v-list class="max-h-160 overflow-auto">
                                    <v-list-item v-if="!month.streams.length" class="text-sm text-slate-400">
                                        No streams
                                    </v-list-item>

                                    <v-list-item
                                        v-for="(stream, sIdx) in month.streams"
                                        :key="stream.video_id ?? sIdx"
                                        :to="{ name: 'stream', params: { id: stream.video_id } }"
                                        link
                                        class="px-0"
                                    >
                                        <div class="flex items-center gap-3 w-full py-2">
                                            <div class="h-10 w-16 shrink-0 overflow-hidden rounded-md bg-slate-900">
                                                <img
                                                    :src="BucketHelper.getThumbnailUrl(stream.video_id)"
                                                    alt="{{ stream.title }} thumbnail"
                                                    class="h-full w-full object-cover shrink-0"
                                                />
                                            </div>

                                            <div class="min-w-0">
                                                <div class="line-clamp-1 font-medium text-sm text-white">
                                                    {{ stream.title }}
                                                </div>

                                                <div class="text-xs text-muted">
                                                    {{ new Date(stream.recorded_at).toLocaleDateString() }}
                                                </div>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </button>
                    </div>
                </div>
            </div>
        </Section>
    </Auth>
</template>

<style scoped>
.pulse-ring {
    animation: pulse-ring 1.6s ease-out infinite;
}

@keyframes pulse-ring {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(255, 215, 0, 0.12);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
    }
}
</style>
