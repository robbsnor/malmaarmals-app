<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

const HIDE_DURATION_MS = 1 * 24 * 60 * 60 * 1000;
const hiddenUntil = useLocalStorage<number | null>('slow-site-banner-hidden-until', null);

const hidden = computed(() => hiddenUntil.value !== null && hiddenUntil.value > Date.now());

function dismiss() {
    hiddenUntil.value = Date.now() + HIDE_DURATION_MS;
}
</script>

<template>
    <Container v-if="!hidden">
        <div
            class="relative mt-4 flex lg:items-center gap-4 rounded-md border border-primary/40 bg-primary/20 px-4 py-3"
        >
            <v-icon color="primary" class="max-lg:hidden!">mdi-information-slab-circle-outline</v-icon>
            <div>
                <div class="font-semibold uppercase">Slow video loading times</div>
                <div class="text-muted">
                    Videos can take a little while to load. This app is partially self-hosted, so performance can be
                    slower when traffic is high.
                </div>
            </div>
            <v-btn
                icon
                variant="tonal"
                size="small"
                class="!absolute top-2 right-2"
                aria-label="Hide slow loading notice"
                @click="dismiss"
            >
                <v-icon size="18">mdi-close</v-icon>
            </v-btn>
        </div>
    </Container>
</template>
