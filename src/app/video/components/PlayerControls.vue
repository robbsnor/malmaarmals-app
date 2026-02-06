<script setup lang="ts">
import { useElementSize, useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useVideoStore } from '../stores/video.store';
import { computed, ref, useTemplateRef } from 'vue';
import ChaptersDrawer from './ChaptersDrawer.vue';
import AddToPlaylist from './AddToPlaylist.vue';
import PlayerButton from './PlayerButton.vue';
import VolumeControl from './VolumeControl.vue';
import { useScreenOrientation } from '@vueuse/core';
import ChapterMarker from './ChapterMarker.vue';
import PreferenceDrawer from './PreferenceDrawer.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { Z } from '../../shared/directives/z.directive';
import { prevRoute } from '../../../router/router';

const videoStore = useVideoStore();
const preferenceStore = usePreferenceStore();
const router = useRouter();
const { isFullscreen, enter, exit, toggle } = useFullscreen();
const durationEl = useTemplateRef<HTMLDivElement>('durationEl');
const { width, height } = useElementSize(durationEl);
const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation();

const goBack = () => {
    videoStore.player.isMini = true;
    router.push(prevRoute.fullPath);
};

function changeOrientation() {
    if (!isSupported) return;

    if (orientation.value === 'landscape-primary' || orientation.value === 'landscape-secondary') {
        console.log('isLandscape');
        unlockOrientation();
        lockOrientation('portrait-primary');
    } else {
        console.log('isPortrait');
        unlockOrientation();
        lockOrientation('landscape-primary');
    }
}

const showMarkers = computed(() => {
    // TODO: Respect PETER vs TIMON video preference
    return preferenceStore.preferences.showChapters;
});
</script>

<template>
    <div
        v-if="!videoStore.player.isMini"
        v-visible="videoStore.showControllsAndInfo && !videoStore.player.isMini"
        class="absolute inset-0 flex flex-col"
        v-z="Z.VIDEO_CONTROLS"
    >
        <div class="absolute inset-0 bg-black/50" @click="videoStore.showControllsAndInfo = false"></div>

        <div class="flex items-center justify-between gap-4 pt-2 px-4">
            <PlayerButton @click="goBack()" icon="mdi-chevron-down" />

            <div class="flex items-center gap-1">
                <AddToPlaylist />
                <PreferenceDrawer />
            </div>
        </div>

        <div class="flex justify-center items-center gap-4 grow">
            <button @click="videoStore.currentTime -= 10">
                <v-icon size="24" icon="mdi-rewind-10" />
            </button>

            <div v-if="videoStore.waiting" class="relative size-16 flex justify-center items-center">
                <v-progress-circular class="relative" indeterminate size="48" width="4" />
            </div>

            <button v-else @click="videoStore.playing = !videoStore.playing">
                <v-icon
                    :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
                    size="64"
                />
            </button>

            <button @click="videoStore.currentTime += 30">
                <v-icon size="24" icon="mdi-fast-forward-30" />
            </button>
        </div>

        <div class="flex flex-col px-4">
            <div class="flex items-end justify-between gap-4">
                <div class="relative flex items-center gap-2 leading-tight">
                    <div :style="{ width: `${width}pfx` }">{{ videoStore.prettyCurrentTime }}</div>
                    /
                    <div ref="durationEl" class="text-right">{{ videoStore.prettyDuration }}</div>
                </div>

                <div class="relative flex items-center gap-2 -mb-2 z-1">
                    <VolumeControl />
                    <ChaptersDrawer />
                    <PlayerButton :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" @click="toggle()" />
                </div>
            </div>

            <div class="relative">
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

                <template v-if="showMarkers">
                    <ChapterMarker v-for="chapter in videoStore.chapters" :key="chapter.start_s" :chapter="chapter" />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.v-slider.v-input--horizontal {
    margin: 0;
}

:deep(.v-slider-thumb) {
}
</style>
