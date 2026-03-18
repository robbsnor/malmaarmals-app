<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    id: string;
    title: string;
    secPlayed: number;
    timePlayed: string;
    timesPlayed: number;
    streamCount: number;
}>();

const emit = defineEmits<{ click: [] }>();

const hoursPlayed = computed(() => {
    const h = Math.floor(props.secPlayed / 3600);
    const m = Math.floor((props.secPlayed % 3600) / 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
});
</script>

<template>
    <button
        class="card-wrapper group relative block w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="emit('click')"
    >
        <div
            class="relative w-full aspect-[208/288] overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg transition-all duration-300 group-hover:border-primary/40"
        >
            <v-img
                :src="`https://static-cdn.jtvnw.net/ttv-boxart/${id}_IGDB-208x288.jpg`"
                :alt="title"
                cover
                class="absolute inset-0 h-full w-full scale-105 transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

            <div class="glare pointer-events-none absolute inset-0" />

            <div
                class="shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 blur-sm"
            />

            <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                <div class="chip backdrop-blur-md">
                    <v-icon icon="mdi-play-circle-outline" size="14" class="text-primary" />
                    <span class="text-xs font-semibold text-primary">{{ streamCount }}</span>
                </div>

                <div class="chip backdrop-blur-md">
                    <v-icon icon="mdi-bookmark-multiple-outline" size="14" class="text-primary" />
                    <span class="text-xs font-semibold text-primary">{{ timesPlayed }}</span>
                </div>
            </div>

            <div
                class="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-black/50 p-3 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-1 group-hover:opacity-0"
            >
                <div class="line-clamp-2 text-sm font-bold leading-tight text-white md:text-base">{{ title }}</div>
                <div class="text-xs mt-1 text-muted">{{ hoursPlayed }} streamed</div>
            </div>

            <div
                class="absolute inset-x-3 bottom-3 rounded-xl border border-primary/30 bg-black/65 p-3 backdrop-blur-md opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
                <div class="mb-3 line-clamp-2 text-base font-bold leading-tight text-white">
                    {{ title }}
                </div>

                <div class="flex flex-col gap-2">
                    <div class="stat-row">
                        <v-icon icon="mdi-clock-outline" size="16" class="text-primary" />
                        <span class="text-primary font-bold text-sm">{{ hoursPlayed }}</span>
                        <span class="text-muted text-sm">played</span>
                    </div>

                    <div class="stat-row">
                        <v-icon icon="mdi-play-circle-outline" size="16" class="text-primary" />
                        <span class="text-primary font-bold text-sm">{{ streamCount }}</span>
                        <span class="text-muted text-sm">{{ streamCount === 1 ? 'stream' : 'streams' }}</span>
                    </div>

                    <div class="stat-row">
                        <v-icon icon="mdi-bookmark-multiple-outline" size="16" class="text-primary" />
                        <span class="text-primary font-bold text-sm">{{ timesPlayed }}</span>
                        <span class="text-muted text-sm">{{ timesPlayed === 1 ? 'chapter' : 'chapters' }}</span>
                    </div>
                </div>
            </div>

            <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            <div
                class="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary/0 transition-all duration-300 group-hover:ring-primary/35"
            />
        </div>

        <div
            class="pointer-events-none absolute inset-0 rounded-2xl bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        />
    </button>
</template>

<style scoped>
.card-wrapper {
    transition:
        transform 180ms ease,
        filter 180ms ease;
}

.card-wrapper:hover {
    transform: translateY(-4px) scale(1.015);
}

.glare {
    background: radial-gradient(
        circle at 50% 20%,
        rgb(255 255 255 / 0.18) 0%,
        rgb(255 255 255 / 0.06) 28%,
        transparent 60%
    );
    opacity: 0.75;
    transition: opacity 180ms ease;
}

.shine {
    transition:
        transform 500ms ease,
        opacity 240ms ease;
}

.card-wrapper:hover .shine {
    transform: translateX(280%);
    opacity: 1;
}

.card-wrapper:hover .glare {
    opacity: 1;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    border: 1px solid rgb(255 255 255 / 0.14);
    background: rgb(0 0 0 / 0.8);
    padding: 4px 8px;
}

.stat-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

@media (hover: none) {
    .card-wrapper:hover {
        transform: none;
    }

    .shine,
    .card-wrapper:hover .shine {
        transform: none;
        opacity: 0;
    }

    .glare,
    .card-wrapper:hover .glare {
        opacity: 0.7;
    }
}
</style>
