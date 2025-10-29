<script setup lang="ts">
import { useElementSize, useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideoStore } from '../stores/video.store';
import { useTemplateRef } from 'vue';
import ChaptersMenu from './ChaptersMenu.vue';

const videoStore = useVideoStore();
const router = useRouter();
const { isFullscreen, enter, exit, toggle } = useFullscreen();
const durationEl = useTemplateRef<HTMLDivElement>('durationEl');
const { width, height } = useElementSize(durationEl);

const goBack = () => {
    router.back();
};
</script>

<template>
    <div
        v-visible="videoStore.showControllsAndInfo && !videoStore.player.isMini"
        class="absolute inset-0 flex flex-col gap-4 z-50"
    >
        <div class="absolute inset-0 bg-black/50" @click="videoStore.showControllsAndInfo = false"></div>

        <div class="flex justify-between gap-4 p-4">
            <v-icon
                @click="
                    videoStore.player.isMini = true;
                    goBack();
                "
                size="28"
                icon="mdi-chevron-down"
            />

            <div class="flex gap-4">
                <v-icon size="28" icon="mdi-fullscreen" @click="toggle()" />
                <v-icon size="28" icon="mdi-cog-outline" />
            </div>
        </div>

        <div class="flex justify-center items-center gap-4 grow p-2">
            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime -= 5">
                <v-icon size="28" icon="mdi-rewind-5" />
            </v-btn>

            <v-btn icon variant="plain" size="x-small" @click="videoStore.currentTime -= 30">
                <v-icon size="28" icon="mdi-rewind-30" />
            </v-btn>

            <v-progress-circular class="relative" v-if="videoStore.waiting" indeterminate size="64" />
            <v-btn v-else icon variant="plain" size="lage" @click="videoStore.playing = !videoStore.playing">
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

        <div class="flex flex-col px-4">
            <div class="flex items-end justify-between gap-4">
                <div class="relative flex items-center gap-4 leading-tight">
                    <div :style="{ width: `${width}pfx` }">{{ videoStore.prettyCurrentTime }}</div>
                    /
                    <div ref="durationEl" class="text-right">{{ videoStore.prettyDuration }}</div>
                </div>

                <div class="relative flex items-center gap-4">
                    <ChaptersMenu size="small" />
                    <v-icon size="24" icon="mdi-phone-rotate-landscape" class="-scale-x-100" @click="toggle()" />
                </div>
            </div>

            <div class="-mx-2">
                <v-slider
                    v-model="videoStore.currentTime"
                    hide-details="auto"
                    thumb-size="12"
                    track-size="4"
                    color="primary"
                    :max="videoStore.duration"
                    :min="0"
                    :step="1"
                />
            </div>
        </div>
    </div>
</template>
