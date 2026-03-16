<script setup lang="ts">
import { ref, watch } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { emotesMap } from '../../shared/data/emotes.data';
import { usePreferenceStore } from '../../shared/stores/preference.store';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Seconds of message history to scan each tick */
const WINDOW_S = 8;

/** Horizontal spawn range (% from left edge) */
const LEFT_MIN = 5;
const LEFT_MAX = 90;

/** Emote size in pixels */
const SIZE_MIN = 16;
const SIZE_MAX = 32;

/** How high the emote floats before disappearing (% from bottom) */
const TARGET_MIN = 20;
const TARGET_MAX = 50;

/** Start opacity (0–1) */
const OPACITY_START = 0.6;

/** Per-emote spawn delay (ms) */
const DELAY_MIN = 0;
const DELAY_MAX = 1200;

/** Float animation duration (ms) */
const DURATION_MIN = 3000;
const DURATION_MAX = 6000;

/** Bottom starting position of each emote (%) */
const SPAWN_BOTTOM = -10;

/** Maximum number of emotes visible at the same time */
const MAX_PARTICLES = 50;

// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
    id: number;
    src: string;
    left: number;
    size: number;
    targetPercent: number;
    delay: number;
    duration: number;
}

const videoStore = useVideoStore();
const preferenceStore = usePreferenceStore();

let particleId = 0;
const particles = ref<Particle[]>([]);
const seenMessageIds = new Set<string>();

const rand = (min: number, max: number) => min + Math.random() * (max - min);

watch(
    () => videoStore.currentTimeRounded,
    (time) => {
        if (!preferenceStore.preferences.showEmojis) return;

        const windowStart = time - WINDOW_S;
        const windowMessages = videoStore.messages.filter((m) => m.offset_sec > windowStart && m.offset_sec <= time);

        for (const msg of windowMessages) {
            if (seenMessageIds.has(msg.message_id)) continue;
            seenMessageIds.add(msg.message_id);

            const words = msg.text.split(' ');
            for (const word of words) {
                if (!emotesMap[word as keyof typeof emotesMap]) continue;
                if (particles.value.length >= MAX_PARTICLES) continue;

                const id = particleId++;
                const duration = rand(DURATION_MIN, DURATION_MAX);

                particles.value.push({
                    id,
                    src: emotesMap[word as keyof typeof emotesMap],
                    left: rand(LEFT_MIN, LEFT_MAX),
                    size: rand(SIZE_MIN, SIZE_MAX),
                    targetPercent: rand(TARGET_MIN, TARGET_MAX),
                    delay: rand(DELAY_MIN, DELAY_MAX),
                    duration,
                });

                setTimeout(
                    () => {
                        particles.value = particles.value.filter((p) => p.id !== id);
                    },
                    duration + DELAY_MAX + 200
                );
            }
        }
    }
);

watch(
    () => preferenceStore.preferences.showEmojis,
    (show) => {
        if (!show) {
            particles.value = [];
            seenMessageIds.clear();
        }
    }
);
</script>

<template>
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <img
            v-for="particle in particles"
            :key="particle.id"
            alt="emote"
            :src="particle.src"
            class="floating-emote absolute object-contain"
            :style="{
                left: `${particle.left}%`,
                '--target': `${particle.targetPercent}%`,
                '--delay': `${particle.delay}ms`,
                '--duration': `${particle.duration}ms`,
                '--spawn-bottom': `${SPAWN_BOTTOM}%`,
                '--opacity-start': OPACITY_START,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
            }"
        />
    </div>
</template>

<style scoped>
.floating-emote {
    bottom: var(--spawn-bottom, 0%);
    opacity: 0;
    animation: float-up var(--duration, 2500ms) var(--delay, 0ms) forwards ease-out;
}

@keyframes float-up {
    0% {
        bottom: var(--spawn-bottom, 0%);
        opacity: var(--opacity-start, 1);
    }
    100% {
        bottom: var(--target, 65%);
        opacity: 0;
    }
}
</style>
