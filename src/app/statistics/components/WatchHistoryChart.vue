<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    type ChartOptions,
    type ChartData,
    type TooltipItem,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useStatsStore } from '../../stats/stores/stats.store';
import { DateHelper } from '../../shared/helpers/date.helper';
import { useAuthStore } from '../../auth/stores/auth.store';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    zoomPlugin
);

const statsStore = useStatsStore();
const authStore = useAuthStore();

const datasets = computed(() => {
    const datasetsByYear = new Map();

    statsStore.history
        .slice()
        .reverse()
        .forEach((item) => {
            const date = new Date(item.watched_at);
            const year = date.getFullYear();
            const day = DateHelper.getDayOfYear(date);
            // const day = date.getMonth();

            if (!datasetsByYear.has(year)) {
                datasetsByYear.set(year, {
                    label: year,
                    borderColor: year === 2026 ? 'hsl(252, 100%, 74%)' : 'pink',
                    data: [],
                    tension: 0.1,
                });
            }

            const set = datasetsByYear.get(year);
            set.data[day] = (set.data[day] ?? 0) + 1;
        });

    return Array.from(datasetsByYear.values());
});

const chartData = computed<ChartData<'line'>>(() => ({
    labels: Array.from({ length: 365 }, (_, i) => {
        const date = new Date(Date.UTC(2026, 0, i));
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
        return `${day} ${month}`;
    }),
    datasets: datasets.value,
}));

const chartOptions: ChartOptions<'line'> = {
    aspectRatio: 3,
    plugins: {
        tooltip: {
            callbacks: {
                title: (items: TooltipItem<'line'>[]) => {
                    const item = items[0];
                    const year = Number(item.dataset.label ?? new Date().getFullYear());
                    const date = new Date(Date.UTC(year, 0, item.dataIndex));
                    const day = date.getUTCDate();
                    const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();

                    return `${day} ${month} ${year}`;
                },
                label: (item: TooltipItem<'line'>) => `${item.formattedValue} videos watched`,
            },
        },
        zoom: {
            pan: {
                enabled: true,
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'x',
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255,255,255,0.1)',
            },
        },
        y: {
            grid: {
                color: 'rgba(255,255,255,0.1)',
            },
        },
    },
};
</script>

<template>
    <Section v-if="authStore.isAdmin" title="Daily views">
        <Line :options="chartOptions" :data="chartData" />
    </Section>
</template>
