<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
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

const glareX = computed(() => Math.round((elementX.value / elementWidth.value) * 100));
const glareY = computed(() => Math.round((elementY.value / elementHeight.value) * 100));

const cardStyle = computed(() => ({
    transform: `perspective(700px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale(${isOutside.value ? 1 : 1.05})`,
    transition: isOutside.value ? 'transform 0.6s cubic-bezier(0.23,1,0.32,1)' : 'transform 0.04s linear',
}));

const glareStyle = computed(() => ({
    background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
    opacity: isOutside.value ? 0 : 1,
    transition: isOutside.value ? 'opacity 0.5s ease' : 'opacity 0.04s linear',
}));

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
        class="card-wrapper group relative rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :style="cardStyle"
        @click="emit('click')"
    >
        <!-- card shell -->
        <div class="relative overflow-hidden rounded-xl w-full aspect-[208/288]">
            <!-- box art -->
            <v-img
                :src="`https://static-cdn.jtvnw.net/ttv-boxart/${id}_IGDB-208x288.jpg`"
                :alt="title"
                cover
                class="absolute inset-0 w-full h-full"
            />

            <!-- bottom title always visible -->
            <div
                class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-0 transition-transform duration-400"
            >
                <div class="absolute bottom-0 inset-x-0 p-4">
                    <p class="text-white font-bold leading-tight line-clamp-2">{{ title }}</p>
                </div>
            </div>

            <!-- hover stats overlay -->
            <div
                class="stats-overlay absolute inset-0 flex flex-col justify-end p-4 gap-1 bg-gradient-to-t from-black/95 via-black/70 to-black/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all ease-out"
            >
                <p class="text-white font-bold leading-tight line-clamp-3 mb-4 drop-shadow-lg">
                    {{ title }}
                </p>

                <div class="flex flex-col gap-2">
                    <div class="stat-row">
                        <v-icon icon="mdi-clock-outline" size="16" class="text-primary opacity-80" />
                        <span class="text-primary font-bold text-sm">{{ hoursPlayed }}</span>
                        <span class="text-muted text-sm">played</span>
                    </div>

                    <div class="stat-row">
                        <v-icon icon="mdi-play-circle-outline" size="16" class="text-primary opacity-80" />
                        <span class="text-primary font-bold text-sm">{{ streamCount }}</span>
                        <span class="text-muted text-sm">{{ streamCount === 1 ? 'stream' : 'streams' }}</span>
                    </div>

                    <div class="stat-row">
                        <v-icon icon="mdi-bookmark-multiple-outline" size="16" class="text-primary opacity-80" />
                        <span class="text-primary font-bold text-sm">{{ timesPlayed }}</span>
                        <span class="text-muted text-sm">{{ timesPlayed === 1 ? 'chapter' : 'chapters' }}</span>
                    </div>
                </div>
            </div>

            <!-- specular glare -->
            <div class="pointer-events-none absolute inset-0 rounded-xl" :style="glareStyle" />

            <!-- shimmer border -->
            <div
                class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-primary/50 transition-all"
            />
        </div>

        <!-- outer glow on hover -->
        <div
            class="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style="box-shadow: 0 0 20px 4px rgba(148, 107, 255, 0.25)"
        />
    </button>
</template>

<style scoped>
.card-wrapper {
    transform-style: preserve-3d;
    will-change: transform;
}

.stat-row {
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
