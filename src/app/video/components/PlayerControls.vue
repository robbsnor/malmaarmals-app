<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideoStore } from '../stores/video.store';

const appStore = useAppStore();
const videoStore = useVideoStore();
const router = useRouter();
const { isFullscreen, enter, exit, toggle } = useFullscreen();

const goBack = () => {
    router.back();
};
</script>

<template>
    <div
        v-visible="videoStore.showMobileControls && !appStore.player.isMini"
        class="absolute inset-0 flex flex-col gap-4"
    >
        <div class="absolute inset-0 bg-black/50" @click="videoStore.showMobileControls = false"></div>

        <div class="flex justify-between gap-4 p-2">
            <v-btn
                icon
                variant="plain"
                size="x-small"
                @click="
                    appStore.player.isMini = true;
                    goBack();
                "
            >
                <v-icon size="28" icon="mdi-chevron-down" />
            </v-btn>
            <div class="flex gap-4">
                <v-icon size="28" icon="mdi-cog-outline" />
                <v-icon size="28" icon="mdi-fullscreen" @click="toggle()" />
            </div>
        </div>

        <div class="flex justify-center items-center gap-4 grow p-2">
            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime -= 5">
                <v-icon size="28" icon="mdi-rewind-5" />
            </v-btn>

            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime -= 30">
                <v-icon size="28" icon="mdi-rewind-30" />
            </v-btn>

            <v-btn icon variant="plain" size="x-small" @click="videoStore.playing = !videoStore.playing">
                <v-icon
                    :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
                    size="64"
                />
            </v-btn>

            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime += 30">
                <v-icon size="28" icon="mdi-fast-forward-30" />
            </v-btn>

            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime += 60">
                <v-icon size="28" icon="mdi-fast-forward-60" />
            </v-btn>
        </div>

        <div class="relative flex justify-between items-center px-2 py-1">
            <div class="min-w-14">{{ videoStore.prettyCurrentTime }}</div>
            <v-slider
                v-model="videoStore.currentTime"
                class="grow"
                hide-details="auto"
                thumb-size="12"
                track-size="4"
                color="primary"
                :max="videoStore.duration"
                :min="0"
                :step="1"
            />
            <div class="min-w-14 text-right">{{ videoStore.prettyDuration }}</div>
        </div>
    </div>
</template>
