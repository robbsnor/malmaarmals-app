<script setup lang="ts">
import { useElementSize, useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideoStore } from '../stores/video.store';
import { ref, useTemplateRef } from 'vue';
import ChaptersDrawer from './ChaptersDrawer.vue';
import AddToPlaylist from './AddToPlaylist.vue';
import PlayerButton from './PlayerButton.vue';
import { useScreenOrientation } from '@vueuse/core';
import ChapterMarker from './ChapterMarker.vue';

const videoStore = useVideoStore();
const router = useRouter();
const { isFullscreen, enter, exit, toggle } = useFullscreen();
const durationEl = useTemplateRef<HTMLDivElement>('durationEl');
const { width, height } = useElementSize(durationEl);

const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation();
const goBack = () => {
    router.back();
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
</script>

<template>
    <div
        v-if="!videoStore.player.isMini"
        v-visible="videoStore.showControllsAndInfo && !videoStore.player.isMini"
        class="absolute inset-0 flex flex-col gap-4 z-50"
    >
        <div class="absolute inset-0 bg-black/50" @click="videoStore.showControllsAndInfo = false"></div>

        <div class="flex items-center justify-between gap-4 py-2 px-4">
            <PlayerButton
                @click="
                    videoStore.player.isMini = true;
                    goBack();
                "
                icon="mdi-chevron-down"
            />

            <div class="flex items-center gap-1">
                <Auth>
                    <v-btn
                        v-if="videoStore.hasChapterChanges"
                        variant="tonal"
                        prepend-icon="mdi-alert-circle-outline"
                        class="cursor-default!"
                        color="error"
                        size="small"
                    >
                        Unsaved changes
                    </v-btn>

                    <PlayerButton :size="28" icon="mdi-playlist-edit" @click="videoStore.showChapterManager = true" />
                </Auth>
                <AddToPlaylist />
                <PlayerButton icon="mdi-cog-outline" />
            </div>
        </div>

        <div class="flex justify-center items-center gap-4 grow p-2">
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

                <div class="relative flex items-center gap-2">
                    <ChaptersDrawer />

                    <PlayerButton :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" @click="toggle()" />
                    <!-- <PlayerButton
                        :size="22"
                        icon="mdi-phone-rotate-landscape"
                        class="-scale-x-100"
                        @click="changeOrientation()"
                    /> -->
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

                <ChapterMarker v-for="chapter in videoStore.chapters" :key="chapter.start_s" :chapter="chapter" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.v-slider.v-input--horizontal {
    margin: 0;
}

:deep(.v-slider-thumb) {
    /* z-index: 22 !important; */
}
</style>
