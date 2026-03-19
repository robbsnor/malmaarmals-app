<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useMouseInElement } from '@vueuse/core';

const props = defineProps<{
    id: string;
    title: string;
    secPlayed: number;
    timePlayed: string;
    timesPlayed: number;
    streamCount: number;
}>();

const emit = defineEmits<{ click: [] }>();

const cardRef = useTemplateRef<HTMLElement>('cardRef');
const { elementX, elementY, isOutside, elementWidth, elementHeight } = useMouseInElement(cardRef);

const tiltX = computed(() =>
    isOutside.value ? 0 : ((elementY.value - elementHeight.value / 2) / (elementHeight.value / 2)) * -8
);
const tiltY = computed(() =>
    isOutside.value ? 0 : ((elementX.value - elementWidth.value / 2) / (elementWidth.value / 2)) * 8
);

const glareX = computed(() => {
    if (isOutside.value) return;
    if (!elementWidth.value) return 50;
    return Math.round((elementX.value / elementWidth.value) * 100);
});

const glareY = computed(() => {
    if (isOutside.value) return;
    if (!elementHeight.value) return 50;
    return Math.round((elementY.value / elementHeight.value) * 100);
});

const cardStyle = computed(() => {
    if (isOutside.value) return;
    return {
        transform: `perspective(950px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale(${isOutside.value ? 1 : 1.03})`,
        transition: isOutside.value ? 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.05s linear',
    };
});

const glareStyle = computed(() => {
    if (isOutside.value) return;
    return {
        background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 68%)`,
        opacity: isOutside.value ? 0 : 1,
        transition: isOutside.value ? 'opacity 0.5s ease' : 'opacity 0.05s linear',
    };
});

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
        ref="cardRef"
        class="card-wrapper group relative block w-full rounded-2xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        :style="cardStyle"
        @click="emit('click')"
    >
        <div
            class="relative w-full aspect-[208/288] overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg transition-all duration-500 group-hover:border-primary/40"
        >
            <v-img
                :src="`https://static-cdn.jtvnw.net/ttv-boxart/${id}_IGDB-208x288.jpg`"
                :alt="title"
                cover
                class="absolute inset-0 h-full w-full transition-all duration-700 ease-out group-hover:scale-102 group-hover:brightness-110"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

            <div class="absolute inset-0 pointer-events-none" :style="glareStyle" />

            <div
                class="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[280%] group-hover:opacity-100"
            />

            <div class="max-md:hidden absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                <div class="chip">
                    <v-icon icon="mdi-play-circle-outline" size="14" class="text-primary" />
                    <span class="text-xs font-semibold text-primary">{{ streamCount }}</span>
                </div>

                <div class="chip">
                    <v-icon icon="mdi-bookmark-multiple-outline" size="14" class="text-primary" />
                    <span class="text-xs font-semibold text-primary">{{ timesPlayed }}</span>
                </div>
            </div>

            <div
                class="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-black/75 p-3 transition-all duration-300 ease-out group-hover:translate-y-1 group-hover:opacity-0"
            >
                <div class="line-clamp-2 text-sm font-bold leading-tight text-white md:text-base">{{ title }}</div>
                <div class="max-md:hidden text-xs mt-1 text-muted">{{ hoursPlayed }} streamed</div>
            </div>

            <div
                class="absolute inset-x-3 bottom-3 rounded-xl border border-primary/30 bg-black/80 p-3 opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
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
            class="pointer-events-none absolute inset-0 rounded-2xl bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
    </button>
</template>

<style scoped>
.card-wrapper {
    transform-style: preserve-3d;
    will-change: transform;
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
</style>
