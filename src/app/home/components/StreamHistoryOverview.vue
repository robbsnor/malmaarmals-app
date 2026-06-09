<script setup lang="ts">
import { computed } from 'vue';
import { useVideosStore } from '../../videos/stores/videos.store.ts';
import { BucketHelper } from '../../shared/helpers/bucket.helper.ts';
import type { Video } from '../../videos/models/video.model.ts';
import Month from './Month.vue';

const videosStore = useVideosStore();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface MonthOverview {
    monthName: string;
    monthIndex: number;
    streams: Video[];
}

export interface YearOverview {
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

const highestStreamPerMonth = computed(() =>
    Math.max(...years.value.flatMap((y) => y.months.map((m) => m.streams.length)))
);

const totalHoursStreamed = computed(() =>
    Math.round(videosStore.videos.reduce((prev, cur) => prev + cur.length_sec, 0) / 3600)
);
</script>

<template>
    <Section title="Stream overiew">
        <template #description>
            <span class="font-bold text-primary">{{ totalHoursStreamed }} hours</span> streamed over a total of
            <span class="font-bold text-primary">{{ videosStore.videos.length }} streams</span>.
        </template>

        <div class="grid gap-2 md:grid-cols-2 md:gap-x-8 md:gap-y-4 lg:grid-cols-3 2xl:grid-cols-4">
            <div v-for="year in years" :key="year.year" class="space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="text-base font-semibold">{{ year.year }}</div>
                    <div class="text-xs text-muted-more">{{ year.totalStreams }} streams</div>
                </div>

                <div class="grid grid-cols-12 gap-2 justify-start">
                    <button v-for="month in year.months" :key="month.monthIndex" class="text-center">
                        <v-menu location="top" max-width="420">
                            <template #activator="{ props }">
                                <Month
                                    v-bind="props"
                                    :highestStreamPerMonth="highestStreamPerMonth"
                                    :month="month"
                                    :year="year"
                                />
                            </template>

                            <v-list class="max-h-160 overflow-auto">
                                <v-list-item v-if="!month.streams.length" class="text-sm text-muted-more">
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
                                        <div class="h-10 w-16 shrink-0 overflow-hidden rounded-md bg-muted-more">
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
</template>
